import { prisma } from "../db";

export interface BranchWithStaffDTO {
  id: string;
  code: string;
  name: string;
  phone: string;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    branchId: string;
  }>;
}

export async function listBranchesWithStaff(): Promise<BranchWithStaffDTO[]> {
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
    staff: b.staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      branchId: s.branchId,
    })),
  }));
}
