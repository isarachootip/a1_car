import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginInputSchema } from "@/lib/validations/userSchema";
import { authenticateUser } from "@/lib/repositories/userRepository";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/domain/authPassword";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const { identifier, password } = loginInputSchema.parse(body);

    const user = await authenticateUser(identifier, password);
    if (!user) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branchId: user.branchId,
      branchName: user.branchName,
    });

    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
