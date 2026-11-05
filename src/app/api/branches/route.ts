import { NextResponse } from "next/server";
import { listBranchesWithStaff } from "@/lib/repositories/branchRepository";

export async function GET(): Promise<NextResponse> {
  try {
    const branches = await listBranchesWithStaff();
    return NextResponse.json({ branches });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดข้อมูลสาขา";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
