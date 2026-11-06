import { prisma } from "../db";
import { AUTO1_BRANCH_CATALOG } from "../data/auto1BranchCatalog";

export interface BranchWithStaffDTO {
  id: string;
  code: string;
  name: string;
  phone: string;
  region: string;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    branchId: string;
  }>;
}

const REGION_BY_CODE: Record<string, string> = Object.fromEntries(
  AUTO1_BRANCH_CATALOG.map((b) => [b.code, b.region])
);

let catalogSyncedInMemory = false;

export async function syncAuto1BranchesCatalog(): Promise<void> {
  const existingBranches = await prisma.branch.findMany({
    include: { staff: true },
  });
  const existingByCode = new Map(existingBranches.map((b) => [b.code, b]));

  for (const item of AUTO1_BRANCH_CATALOG) {
    const found = existingByCode.get(item.code);
    if (!found) {
      await prisma.branch.create({
        data: {
          code: item.code,
          name: item.name,
          phone: item.phone,
          staff: {
            create: item.staff,
          },
        },
      });
    } else {
      if (found.name !== item.name || found.phone !== item.phone) {
        await prisma.branch.update({
          where: { id: found.id },
          data: { name: item.name, phone: item.phone },
        });
      }
      const existingNames = new Set(found.staff.map((s) => s.name));
      for (const s of item.staff) {
        if (!existingNames.has(s.name)) {
          await prisma.staffUser.create({
            data: {
              name: s.name,
              role: s.role,
              branchId: found.id,
            },
          });
        }
      }
    }
  }
  catalogSyncedInMemory = true;
}

export async function listBranchesWithStaff(): Promise<BranchWithStaffDTO[]> {
  if (!catalogSyncedInMemory) {
    const count = await prisma.branch.count();
    if (count < AUTO1_BRANCH_CATALOG.length) {
      await syncAuto1BranchesCatalog();
    } else {
      catalogSyncedInMemory = true;
    }
  }

  const rows = await prisma.branch.findMany({
    include: {
      staff: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return rows.map((b) => ({
    id: b.id,
    code: b.code,
    name: b.name,
    phone: b.phone,
    region: REGION_BY_CODE[b.code] ?? "สาขาทั่วไป",
    staff: b.staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      branchId: s.branchId,
    })),
  }));
}
