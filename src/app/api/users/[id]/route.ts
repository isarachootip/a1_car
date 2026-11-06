import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateStaffUserAccount } from "@/lib/repositories/userRepository";
import { updateUserInputSchema } from "@/lib/validations/userSchema";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body: unknown = await req.json();
    const parsed = updateUserInputSchema.parse(body);
    const user = await updateStaffUserAccount(id, parsed);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const msg =
      error instanceof Error ? error.message : "อัปเดตข้อมูลผู้ใช้งานไม่สำเร็จ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
