import { z } from "zod";

export const userRoleSchema = z.enum(["SYSADMIN", "ADMIN", "STAFF"]);

export const loginInputSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "กรุณาระบุชื่อผู้ใช้งาน (Username หรือ ชื่อพนักงาน)"),
  password: z.string().min(1, "กรุณาระบุรหัสผ่าน"),
});

export const createUserInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username ต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50),
  name: z
    .string()
    .trim()
    .min(2, "กรุณาระบุชื่อ-นามสกุล และตำแหน่งพนักงาน")
    .max(120),
  role: userRoleSchema.default("STAFF"),
  branchId: z.string().min(1, "กรุณาเลือกสาขาที่สังกัด"),
  password: z
    .string()
    .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
    .default("1234"),
  isActive: z.boolean().default(true),
});

export const updateUserInputSchema = z.object({
  username: z.string().trim().min(2).max(50).optional(),
  name: z.string().trim().min(2).max(120).optional(),
  role: userRoleSchema.optional(),
  branchId: z.string().min(1).optional(),
  password: z.string().min(4).optional(),
  isActive: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type CreateUserInput = z.input<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
