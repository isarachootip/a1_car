import { prisma } from "../db";
import {
  generateStaffUsername,
  hashPassword,
  STAFF_DEFAULT_PASSWORD,
  SYSADMIN_DEFAULT_PASSWORD,
  SYSADMIN_USERNAME,
  verifyPassword,
} from "../domain/authPassword";
import {
  CreateUserInput,
  createUserInputSchema,
  UpdateUserInput,
  updateUserInputSchema,
} from "../validations/userSchema";
import { syncAuto1BranchesCatalog } from "./branchRepository";

export interface UserAccountDTO {
  id: string;
  username: string;
  name: string;
  role: "SYSADMIN" | "ADMIN" | "STAFF";
  isActive: boolean;
  branchId: string;
  branchCode: string;
  branchName: string;
  branchPhone: string;
}

function toUserDTO(u: {
  id: string;
  username: string;
  name: string;
  role: string;
  isActive: boolean;
  branchId: string;
  branch: { code: string; name: string; phone: string };
}): UserAccountDTO {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    role: (u.role as "SYSADMIN" | "ADMIN" | "STAFF") || "STAFF",
    isActive: u.isActive,
    branchId: u.branchId,
    branchCode: u.branch.code,
    branchName: u.branch.name,
    branchPhone: u.branch.phone,
  };
}

let credentialsInitialized = false;

export async function ensureSysAdminAndStaffCredentials(): Promise<void> {
  await syncAuto1BranchesCatalog();

  const branches = await prisma.branch.findMany({
    include: { staff: { orderBy: { createdAt: "asc" } } },
    orderBy: { code: "asc" },
  });
  if (branches.length === 0) return;

  const hqBranch =
    branches.find((b) => b.code === "BKK-CHIDLOM") ??
    branches.find((b) => b.code === "BKK-RAMA3") ??
    branches[0];

  const defaultStaffHash = hashPassword(STAFF_DEFAULT_PASSWORD, "auto1staff");
  const sysAdminHash = hashPassword(SYSADMIN_DEFAULT_PASSWORD, "auto1sysadmin");
  let sysAdminFound = false;

  for (const branch of branches) {
    let idx = 0;
    for (const s of branch.staff) {
      if (s.username === SYSADMIN_USERNAME || s.role === "SYSADMIN") {
        sysAdminFound = true;
        if (!s.passwordHash || s.username !== SYSADMIN_USERNAME) {
          await prisma.staffUser.update({
            where: { id: s.id },
            data: { username: SYSADMIN_USERNAME, role: "SYSADMIN", passwordHash: sysAdminHash, isActive: true },
          });
        }
        continue;
      }

      const expectedUsername = s.username || generateStaffUsername(branch.code, idx);
      const expectedHash = s.passwordHash || defaultStaffHash;
      if (s.username !== expectedUsername || s.passwordHash !== expectedHash) {
        await prisma.staffUser.update({
          where: { id: s.id },
          data: { username: expectedUsername, passwordHash: expectedHash },
        });
      }
      idx++;
    }
  }

  if (!sysAdminFound && hqBranch) {
    await prisma.staffUser.create({
      data: {
        username: SYSADMIN_USERNAME,
        name: "ผู้ดูแลระบบสูงสุด (System Administrator)",
        role: "SYSADMIN",
        passwordHash: sysAdminHash,
        isActive: true,
        branchId: hqBranch.id,
      },
    });
  }

  credentialsInitialized = true;
}

export async function listAllUsers(): Promise<UserAccountDTO[]> {
  if (!credentialsInitialized) await ensureSysAdminAndStaffCredentials();
  const rows = await prisma.staffUser.findMany({
    include: { branch: true },
    orderBy: [{ role: "desc" }, { username: "asc" }],
  });
  return rows.map(toUserDTO);
}

export async function authenticateUser(
  identifier: string,
  password: string
): Promise<UserAccountDTO | null> {
  if (!credentialsInitialized) await ensureSysAdminAndStaffCredentials();
  const q = identifier.trim().toLowerCase();
  if (!q || !password) return null;

  const rows = await prisma.staffUser.findMany({
    where: { isActive: true },
    include: { branch: true },
  });

  const matched = rows.filter((u) => {
    const uname = u.username.trim().toLowerCase();
    const fullName = u.name.trim().toLowerCase();
    const shortName = u.name.split("(")[0]?.trim().toLowerCase() ?? "";
    return uname === q || fullName === q || shortName === q;
  });

  for (const candidate of matched) {
    if (verifyPassword(password, candidate.passwordHash)) {
      return toUserDTO(candidate);
    }
  }
  return null;
}

export async function createStaffUserAccount(rawInput: CreateUserInput): Promise<UserAccountDTO> {
  const input = createUserInputSchema.parse(rawInput);
  const existing = await prisma.staffUser.findFirst({
    where: { username: input.username.toLowerCase() },
  });
  if (existing) throw new Error(`Username "${input.username}" มีอยู่ในระบบแล้ว`);

  const created = await prisma.staffUser.create({
    data: {
      username: input.username.trim().toLowerCase(),
      name: input.name,
      role: input.role,
      branchId: input.branchId,
      passwordHash: hashPassword(input.password),
      isActive: input.isActive,
    },
    include: { branch: true },
  });
  return toUserDTO(created);
}

export async function updateStaffUserAccount(
  id: string,
  rawInput: UpdateUserInput
): Promise<UserAccountDTO> {
  const input = updateUserInputSchema.parse(rawInput);
  const dataToUpdate: Record<string, unknown> = {};
  if (input.username !== undefined) dataToUpdate.username = input.username.trim().toLowerCase();
  if (input.name !== undefined) dataToUpdate.name = input.name;
  if (input.role !== undefined) dataToUpdate.role = input.role;
  if (input.branchId !== undefined) dataToUpdate.branchId = input.branchId;
  if (input.isActive !== undefined) dataToUpdate.isActive = input.isActive;
  if (input.password !== undefined && input.password.trim().length > 0) {
    dataToUpdate.passwordHash = hashPassword(input.password);
  }

  const updated = await prisma.staffUser.update({
    where: { id },
    data: dataToUpdate,
    include: { branch: true },
  });
  return toUserDTO(updated);
}
