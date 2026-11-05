export type OrderStatus =
  | "DRAFT_PICKUP"
  | "PICKED_UP_LOCKED"
  | "COMPLETED";

export type HandoverPhase = "PICKUP" | "DELIVERY";

export type FuelLevel = "1/4" | "1/2" | "3/4" | "FULL";

export type DamageZone = "FRONT" | "LEFT" | "VEHICLE" | "RIGHT" | "REAR";

export type DamageType = "R" | "D" | "C" | "S";

export type PhotoCategory =
  | "FRONT"
  | "REAR"
  | "LEFT"
  | "RIGHT"
  | "DASHBOARD"
  | "DAMAGE_EXTRA";

export const REQUIRED_PHOTO_CATEGORIES: readonly PhotoCategory[] = [
  "FRONT",
  "REAR",
  "LEFT",
  "RIGHT",
  "DASHBOARD",
] as const;

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  FRONT: "ด้านหน้ารถ (Front)",
  REAR: "ด้านหลังรถ (Rear)",
  LEFT: "ด้านข้างซ้าย (Left)",
  RIGHT: "ด้านข้างขวา (Right)",
  DASHBOARD: "หน้าปัดไมล์/ระดับน้ำมัน (Dashboard)",
  DAMAGE_EXTRA: "จุดรอยแผล/ทรัพย์สินเพิ่มเติม (Extra)",
};

export const DAMAGE_TYPE_LABELS: Record<
  DamageType,
  { code: DamageType; label: string; colorClass: string }
> = {
  R: { code: "R", label: "รอยขีดข่วน", colorClass: "bg-amber-500 text-white" },
  D: { code: "D", label: "รอยบุบ", colorClass: "bg-red-600 text-white" },
  C: { code: "C", label: "รอยแตกร้าว", colorClass: "bg-purple-600 text-white" },
  S: { code: "S", label: "คราบแน่น/สนิม", colorClass: "bg-teal-700 text-white" },
};

export const FUEL_LEVEL_LABELS: Record<FuelLevel, string> = {
  "1/4": "1/4",
  "1/2": "1/2",
  "3/4": "3/4",
  FULL: "เต็มถัง",
};

export interface DamageMarkRecord {
  id?: string;
  phase: HandoverPhase;
  zone: DamageZone;
  type: DamageType;
  posX: number;
  posY: number;
  note: string;
}

export interface VehiclePhotoRecord {
  id: string;
  phase: HandoverPhase;
  category: PhotoCategory;
  fileUrl: string;
  caption: string;
  takenAt: string;
}

export interface HandoverOrderDTO {
  id: string;
  docNumber: string;
  publicToken: string;
  status: OrderStatus;
  branchId: string;
  branch: { id: string; code: string; name: string; phone: string };
  staffId: string;
  staff: { id: string; name: string; role: string };
  customerName: string;
  customerPhone: string;
  vehicleBrandModel: string;
  licensePlate: string;
  vehicleColor: string;
  pickupMileage: number;
  pickupFuelLevel: FuelLevel;
  serviceStandard: boolean;
  serviceOilFluid: boolean;
  serviceTireAlignment: boolean;
  serviceBrakeSuspension: boolean;
  serviceAdditionalNote: string;
  invRegistrationBook: boolean;
  invSpareKeyRemote: boolean;
  invSpareTireJack: boolean;
  invDashcamTollCard: boolean;
  invOtherValuables: string;
  pickupCustomerSig: string | null;
  pickupCustomerSignerName: string | null;
  pickupCustomerSignedAt: string | null;
  pickupStaffSig: string | null;
  pickupStaffSignerName: string | null;
  pickupStaffSignedAt: string | null;
  deliveryMileage: number | null;
  deliveryFuelLevel: FuelLevel | null;
  deliveryCustomerSig: string | null;
  deliveryCustomerSigner: string | null;
  deliveryCustomerSignedAt: string | null;
  deliveryStaffSig: string | null;
  deliveryStaffSigner: string | null;
  deliveryStaffSignedAt: string | null;
  damageMarks: DamageMarkRecord[];
  photos: VehiclePhotoRecord[];
  createdAt: string;
  updatedAt: string;
}
