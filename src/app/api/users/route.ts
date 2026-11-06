import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createStaffUserAccount,
  listAllUsers,
} from "@/lib/repositories/userRepository";
import { createUserInputSchema } from "@/lib/validations/userSchema";

export async function GET(): Promise<NextResponse> {
  try {
    const users = await listAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "โหลดรายชื่อผู้ใช้งานไม่สำเร็จ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = createUserInputSchema.parse(body);
    const user = await createStaffUserAccount(parsed);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "ข้อมูลผู้ใช้งานไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const msg =
      error instanceof Error ? error.message : "สร้างผู้ใช้งานไม่สำเร็จ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
