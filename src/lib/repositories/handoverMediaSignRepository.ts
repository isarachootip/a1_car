import { z } from "zod";
import { prisma } from "../db";
import {
  canEditDeliverySection,
  canEditPickupSection,
  computeNextOrderStatusAfterSign,
  getMissingRequiredPhotoCategories,
} from "../domain/handoverRules";
import {
  HandoverOrderDTO,
  HandoverPhase,
  OrderStatus,
  PhotoCategory,
} from "../types/handover";
import { signOrderSchema } from "../validations/handoverSchema";
import { mapOrderToDTO } from "./handoverMapper";
import { getHandoverOrderById, ORDER_INCLUDE } from "./handoverRepository";

export async function addOrderPhoto(
  orderId: string,
  photo: {
    phase: HandoverPhase;
    category: PhotoCategory;
    fileUrl: string;
    caption?: string;
  }
): Promise<HandoverOrderDTO> {
  const current = await prisma.handoverOrder.findUnique({
    where: { id: orderId },
  });
  if (!current) throw new Error("ไม่พบใบงาน");
  if (
    photo.phase === "PICKUP" &&
    !canEditPickupSection(current.status as OrderStatus)
  ) {
    throw new Error("ขารับรถถูกล็อกแล้ว ไม่สามารถเพิ่มรูปได้");
  }
  if (
    photo.phase === "DELIVERY" &&
    !canEditDeliverySection(current.status as OrderStatus)
  ) {
    throw new Error("ไม่สามารถเพิ่มรูปขาส่งคืนในสถานะปัจจุบัน");
  }
  await prisma.vehiclePhoto.create({
    data: {
      orderId,
      phase: photo.phase,
      category: photo.category,
      fileUrl: photo.fileUrl,
      caption: photo.caption ?? "",
    },
  });
  const refreshed = await getHandoverOrderById(orderId);
  if (!refreshed) throw new Error("ไม่พบใบงาน");
  return refreshed;
}

export async function deleteOrderPhoto(
  orderId: string,
  photoId: string
): Promise<HandoverOrderDTO> {
  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } });
  const current = await prisma.handoverOrder.findUnique({
    where: { id: orderId },
  });
  if (!photo || !current) throw new Error("ไม่พบรูปภาพหรือใบงาน");
  if (
    photo.phase === "PICKUP" &&
    !canEditPickupSection(current.status as OrderStatus)
  ) {
    throw new Error("ขารับรถถูกล็อกแล้ว ไม่สามารถลบรูปได้");
  }
  if (
    photo.phase === "DELIVERY" &&
    !canEditDeliverySection(current.status as OrderStatus)
  ) {
    throw new Error("ขาส่งคืนถูกล็อกแล้ว ไม่สามารถลบรูปได้");
  }
  await prisma.vehiclePhoto.delete({ where: { id: photoId } });
  const refreshed = await getHandoverOrderById(orderId);
  if (!refreshed) throw new Error("ไม่พบใบงาน");
  return refreshed;
}

export async function recordOrderSignature(
  orderId: string,
  input: z.infer<typeof signOrderSchema>
): Promise<HandoverOrderDTO> {
  const current = await getHandoverOrderById(orderId);
  if (!current) throw new Error("ไม่พบใบงาน");

  if (input.phase === "PICKUP") {
    if (!canEditPickupSection(current.status)) {
      throw new Error("ขั้นตอนรับรถถูกล็อกแล้ว");
    }
    const missingPhotos = getMissingRequiredPhotoCategories(
      current.photos,
      "PICKUP"
    );
    if (input.role === "CUSTOMER" && missingPhotos.length > 0) {
      throw new Error(
        `กรุณาถ่ายรูปรถขารับให้ครบ 5 มุมก่อนลูกค้าลงนาม (ขาด: ${missingPhotos.join(", ")})`
      );
    }
  } else {
    if (!canEditDeliverySection(current.status)) {
      throw new Error("ยังไม่สามารถลงนามขาส่งคืนได้ หรือเอกสารถูกล็อกแล้ว");
    }
    if (current.deliveryMileage === null || !current.deliveryFuelLevel) {
      throw new Error("กรุณาระบุเลขไมล์และระดับน้ำมันหลังส่งคืนก่อนลงนาม");
    }
  }

  const now = new Date();
  const nextStatus = computeNextOrderStatusAfterSign({
    currentStatus: current.status,
    hasPickupStaffSig:
      Boolean(current.pickupStaffSig) ||
      (input.phase === "PICKUP" && input.role === "STAFF"),
    hasPickupCustomerSig:
      Boolean(current.pickupCustomerSig) ||
      (input.phase === "PICKUP" && input.role === "CUSTOMER"),
    hasDeliveryStaffSig:
      Boolean(current.deliveryStaffSig) ||
      (input.phase === "DELIVERY" && input.role === "STAFF"),
    hasDeliveryCustomerSig:
      Boolean(current.deliveryCustomerSig) ||
      (input.phase === "DELIVERY" && input.role === "CUSTOMER"),
  });

  const dataToUpdate =
    input.phase === "PICKUP"
      ? input.role === "CUSTOMER"
        ? {
            pickupCustomerSig: input.signatureDataUrl,
            pickupCustomerSignerName: input.signerName,
            pickupCustomerSignedAt: now,
            status: nextStatus,
          }
        : {
            pickupStaffSig: input.signatureDataUrl,
            pickupStaffSignerName: input.signerName,
            pickupStaffSignedAt: now,
            status: nextStatus,
          }
      : input.role === "CUSTOMER"
        ? {
            deliveryCustomerSig: input.signatureDataUrl,
            deliveryCustomerSigner: input.signerName,
            deliveryCustomerSignedAt: now,
            status: nextStatus,
          }
        : {
            deliveryStaffSig: input.signatureDataUrl,
            deliveryStaffSigner: input.signerName,
            deliveryStaffSignedAt: now,
            status: nextStatus,
          };

  const updated = await prisma.handoverOrder.update({
    where: { id: orderId },
    data: dataToUpdate,
    include: ORDER_INCLUDE,
  });
  return mapOrderToDTO(updated);
}
