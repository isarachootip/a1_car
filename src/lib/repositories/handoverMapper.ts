import { Prisma } from "@prisma/client";
import {
  DamageType,
  DamageZone,
  FuelLevel,
  HandoverOrderDTO,
  HandoverPhase,
  OrderStatus,
  PhotoCategory,
  ServiceLocationType,
} from "../types/handover";

export type HandoverOrderWithRelations = Prisma.HandoverOrderGetPayload<{
  include: {
    branch: true;
    staff: true;
    damageMarks: true;
    photos: true;
  };
}>;

export function mapOrderToDTO(
  row: HandoverOrderWithRelations
): HandoverOrderDTO {
  return {
    id: row.id,
    docNumber: row.docNumber,
    publicToken: row.publicToken,
    status: row.status as OrderStatus,
    serviceLocationType: (row.serviceLocationType as ServiceLocationType) ?? "ON_SITE",
    pickupLocation: row.pickupLocation ?? "",
    pickupMapUrl: row.pickupMapUrl ?? "",
    scheduledAt: row.scheduledAt ?? "",
    branchId: row.branchId,
    branch: {
      id: row.branch.id,
      code: row.branch.code,
      name: row.branch.name,
      phone: row.branch.phone,
    },
    staffId: row.staffId,
    staff: {
      id: row.staff.id,
      name: row.staff.name,
      role: row.staff.role,
    },
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    vehicleBrandModel: row.vehicleBrandModel,
    licensePlate: row.licensePlate,
    vehicleColor: row.vehicleColor,
    pickupMileage: row.pickupMileage,
    pickupFuelLevel: row.pickupFuelLevel as FuelLevel,
    serviceStandard: row.serviceStandard,
    serviceOilFluid: row.serviceOilFluid,
    serviceTireAlignment: row.serviceTireAlignment,
    serviceBrakeSuspension: row.serviceBrakeSuspension,
    serviceAdditionalNote: row.serviceAdditionalNote,
    invRegistrationBook: row.invRegistrationBook,
    invSpareKeyRemote: row.invSpareKeyRemote,
    invSpareTireJack: row.invSpareTireJack,
    invDashcamTollCard: row.invDashcamTollCard,
    invOtherValuables: row.invOtherValuables,
    pickupCustomerSig: row.pickupCustomerSig,
    pickupCustomerSignerName: row.pickupCustomerSignerName,
    pickupCustomerSignedAt: row.pickupCustomerSignedAt
      ? row.pickupCustomerSignedAt.toISOString()
      : null,
    pickupStaffSig: row.pickupStaffSig,
    pickupStaffSignerName: row.pickupStaffSignerName,
    pickupStaffSignedAt: row.pickupStaffSignedAt
      ? row.pickupStaffSignedAt.toISOString()
      : null,
    deliveryMileage: row.deliveryMileage,
    deliveryFuelLevel: (row.deliveryFuelLevel as FuelLevel) ?? null,
    deliveryCustomerSig: row.deliveryCustomerSig,
    deliveryCustomerSigner: row.deliveryCustomerSigner,
    deliveryCustomerSignedAt: row.deliveryCustomerSignedAt
      ? row.deliveryCustomerSignedAt.toISOString()
      : null,
    deliveryStaffSig: row.deliveryStaffSig,
    deliveryStaffSigner: row.deliveryStaffSigner,
    deliveryStaffSignedAt: row.deliveryStaffSignedAt
      ? row.deliveryStaffSignedAt.toISOString()
      : null,
    damageMarks: row.damageMarks.map((d) => ({
      id: d.id,
      phase: d.phase as HandoverPhase,
      zone: d.zone as DamageZone,
      type: d.type as DamageType,
      posX: d.posX,
      posY: d.posY,
      note: d.note,
    })),
    photos: row.photos.map((p) => ({
      id: p.id,
      phase: p.phase as HandoverPhase,
      category: p.category as PhotoCategory,
      fileUrl: p.fileUrl,
      caption: p.caption,
      takenAt: p.takenAt.toISOString(),
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
