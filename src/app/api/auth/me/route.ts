import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/domain/authPassword";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = verifySessionToken(token);
  return NextResponse.json({ user });
}
