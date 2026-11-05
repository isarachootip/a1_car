import { z } from "zod";
import { prisma } from "../db";
import { formatDocumentNumber } from "../domain/docNumber";
import {
  canEditDeliverySection,
  canEditPickupSection,
} from "../domain/handoverRules";
import { HandoverOrderDTO, OrderStatus } from "../types/handover";
import {
  createOrderSchema,
  updateDeliveryOrderSchema,
  updatePickupOrderSchema,
} from "../validations/handoverSchema";
import { mapOrderToDTO } from "./handoverMapper";

export const ORDER_INCLUDE = {
  branch: true,
  staff: true,
  damageMarks: { orderBy: { createdAt: "asc" as const } },
  photos: { orderBy: { takenAt: "asc" as const } },
};

export async function listHandoverOrders(): Promise<HandoverOrderDTO[]> {
  const rows = await prisma.handoverOrder.findMany({
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapOrderToDTO);
}

export async function getHandoverOrderById(
  id: string
): Promise<HandoverOrderDTO | null> {
  const row = await prisma.handoverOrder.findUnique({
    where: { id },
    include: ORDER_INCLUDE,
  });
  return row ? mapOrderToDTO(row) : null;
}

export async function getHandoverOrderByToken(
  publicToken: string
): Promise<HandoverOrderDTO | null> {
  const row = await prisma.handoverOrder.findUnique({
    where: { publicToken },
    include: ORDER_INCLUDE,
  });
  return row ? mapOrderToDTO(row) : null;
}

export async function createHandoverOrder(
  rawInput: z.input<typeof createOrderSchema>
): Promise<HandoverOrderDTO> {
  const input = createOrderSchema.parse(rawInput);
  const year = new Date().getFullYear();
  const count = await prisma.handoverOrder.count();
  let seq = count + 1;
  let docNumber = formatDocumentNumber(year, seq);
  while (await prisma.handoverOrder.findUnique({ where: { docNumber } })) {
    seq += 1;
    docNumber = formatDocumentNumber(year, seq);
  }

  const created = await prisma.handoverOrder.create({
    data: {
      docNumber,
      ...input,
    },
    include: ORDER_INCLUDE,
  });
  return mapOrderToDTO(created);
}

export async function updatePickupOrderData(
  id: string,
  input: z.infer<typeof updatePickupOrderSchema>
): Promise<HandoverOrderDTO> {
  const current = await prisma.handoverOrder.findUnique({ where: { id } });
  if (!current) throw new Error("ไม่พบใบงาน");
  if (!canEditPickupSection(current.status as OrderStatus)) {
    throw new Error("เอกสารขารับรถถูกล็อกแล้ว ไม่สามารถแก้ไขข้อมูลขารับได้");
  }

  const { damageMarks, ...fields } = input;
  const updated = await prisma.$transaction(async (tx) => {
    if (damageMarks !== undefined) {
      await tx.damageMark.deleteMany({
        where: { orderId: id, phase: "PICKUP" },
      });
      if (damageMarks.length > 0) {
        await tx.damageMark.createMany({
          data: damageMarks.map((m) => ({
            orderId: id,
            phase: "PICKUP",
            zone: m.zone,
            type: m.type,
            posX: m.posX,
            posY: m.posY,
            note: m.note ?? "",
          })),
        });
      }
    }
    return tx.handoverOrder.update({
      where: { id },
      data: fields,
      include: ORDER_INCLUDE,
    });
  });
  return mapOrderToDTO(updated);
}

export async function updateDeliveryOrderData(
  id: string,
  input: z.infer<typeof updateDeliveryOrderSchema>
): Promise<HandoverOrderDTO> {
  const current = await prisma.handoverOrder.findUnique({ where: { id } });
  if (!current) throw new Error("ไม่พบใบงาน");
  if (!canEditDeliverySection(current.status as OrderStatus)) {
    throw new Error(
      "ยังไม่สามารถแก้ไขข้อมูลขาส่งคืน หรือเอกสารถูกล็อกสมบูรณ์แล้ว"
    );
  }

  const { damageMarks, ...fields } = input;
  const updated = await prisma.$transaction(async (tx) => {
    if (damageMarks !== undefined) {
      await tx.damageMark.deleteMany({
        where: { orderId: id, phase: "DELIVERY" },
      });
      if (damageMarks.length > 0) {
        await tx.damageMark.createMany({
          data: damageMarks.map((m) => ({
            orderId: id,
            phase: "DELIVERY",
            zone: m.zone,
            type: m.type,
            posX: m.posX,
            posY: m.posY,
            note: m.note ?? "",
          })),
        });
      }
    }
    return tx.handoverOrder.update({
      where: { id },
      data: fields,
      include: ORDER_INCLUDE,
    });
  });
  return mapOrderToDTO(updated);
}

export {
  addOrderPhoto,
  deleteOrderPhoto,
  recordOrderSignature,
} from "./handoverMediaSignRepository";
