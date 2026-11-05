import { z } from "zod";

export const fuelLevelSchema = z.enum(["1/4", "1/2", "3/4", "FULL"]);
export const serviceLocationTypeSchema = z.enum(["ON_SITE", "AT_BRANCH"]);
export const phaseSchema = z.enum(["PICKUP", "DELIVERY"]);
export const damageZoneSchema = z.enum([
  "FRONT",
  "LEFT",
  "VEHICLE",
  "RIGHT",
  "REAR",
]);
export const damageTypeSchema = z.enum(["R", "D", "C", "S"]);
export const photoCategorySchema = z.enum([
  "FRONT",
  "REAR",
  "LEFT",
  "RIGHT",
  "DASHBOARD",
  "DAMAGE_EXTRA",
]);

export const damageMarkInputSchema = z.object({
  phase: phaseSchema,
  zone: damageZoneSchema,
  type: damageTypeSchema,
  posX: z.number().min(0).max(100),
  posY: z.number().min(0).max(100),
  note: z.string().max(200).optional().default(""),
});

export const createOrderSchema = z.object({
  branchId: z.string().min(1, "กรุณาเลือกสาขา"),
  staffId: z.string().min(1, "กรุณาเลือกเจ้าหน้าที่ผู้ติดต่อ"),
  serviceLocationType: serviceLocationTypeSchema.optional().default("ON_SITE"),
  pickupLocation: z.string().max(400).optional().default(""),
  pickupMapUrl: z.string().max(500).optional().default(""),
  scheduledAt: z.string().max(100).optional().default(""),
  customerName: z.string().min(2, "กรุณาระบุชื่อ-นามสกุลลูกค้า"),
  customerPhone: z
    .string()
    .min(9, "กรุณาระบุเบอร์โทรศัพท์อย่างน้อย 9 หลัก"),
  vehicleBrandModel: z.string().min(2, "กรุณาระบุยี่ห้อ / รุ่นรถยนต์"),
  licensePlate: z.string().min(2, "กรุณาระบุทะเบียนรถ / จังหวัด"),
  vehicleColor: z.string().min(1, "กรุณาระบุสีรถ"),
  pickupMileage: z.number().int().min(0, "เลขไมล์ต้องไม่ติดลบ").optional().default(0),
  pickupFuelLevel: fuelLevelSchema.optional().default("1/2"),
  serviceStandard: z.boolean().optional().default(false),
  serviceOilFluid: z.boolean().optional().default(false),
  serviceTireAlignment: z.boolean().optional().default(false),
  serviceBrakeSuspension: z.boolean().optional().default(false),
  serviceAdditionalNote: z.string().max(500).optional().default(""),
});

export const updatePickupOrderSchema = z.object({
  branchId: z.string().min(1).optional(),
  staffId: z.string().min(1).optional(),
  serviceLocationType: serviceLocationTypeSchema.optional(),
  pickupLocation: z.string().max(400).optional(),
  pickupMapUrl: z.string().max(500).optional(),
  scheduledAt: z.string().max(100).optional(),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().min(9).optional(),
  vehicleBrandModel: z.string().min(2).optional(),
  licensePlate: z.string().min(2).optional(),
  vehicleColor: z.string().min(1).optional(),
  pickupMileage: z.number().int().min(0).optional(),
  pickupFuelLevel: fuelLevelSchema.optional(),
  serviceStandard: z.boolean().optional(),
  serviceOilFluid: z.boolean().optional(),
  serviceTireAlignment: z.boolean().optional(),
  serviceBrakeSuspension: z.boolean().optional(),
  serviceAdditionalNote: z.string().max(500).optional(),
  invRegistrationBook: z.boolean().optional(),
  invSpareKeyRemote: z.boolean().optional(),
  invSpareTireJack: z.boolean().optional(),
  invDashcamTollCard: z.boolean().optional(),
  invOtherValuables: z.string().max(500).optional(),
  damageMarks: z.array(damageMarkInputSchema).optional(),
});

export const updateDeliveryOrderSchema = z.object({
  deliveryMileage: z.number().int().min(0, "เลขไมล์หลังส่งคืนต้องไม่ติดลบ"),
  deliveryFuelLevel: fuelLevelSchema,
  damageMarks: z.array(damageMarkInputSchema).optional(),
});

export const uploadPhotoSchema = z.object({
  phase: phaseSchema,
  category: photoCategorySchema,
  dataUrl: z.string().startsWith("data:image/", "รูปภาพไม่ถูกต้อง"),
  caption: z.string().max(200).optional().default(""),
});

export const signOrderSchema = z.object({
  phase: phaseSchema,
  role: z.enum(["CUSTOMER", "STAFF"]),
  signerName: z.string().min(2, "กรุณาระบุชื่อ-นามสกุลผู้ลงนาม"),
  signatureDataUrl: z
    .string()
    .startsWith("data:image/png;base64,", "กรุณาลงลายมือชื่อ"),
  phoneLast4: z.string().length(4).optional(),
});
