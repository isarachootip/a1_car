import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyCustomerPhoneLast4 } from "@/lib/domain/handoverRules";
import {
  getHandoverOrderByToken,
  recordOrderSignature,
} from "@/lib/repositories/handoverRepository";
import { signOrderSchema } from "@/lib/validations/handoverSchema";

const verifyPhoneBodySchema = z.object({
  action: z.literal("VERIFY_PHONE"),
  phoneLast4: z.string().length(4, "กรุณากรอกเลขท้ายเบอร์โทรศัพท์ 4 หลัก"),
});

const signRemoteBodySchema = z.object({
  action: z.literal("SIGN_CUSTOMER"),
  phoneLast4: z.string().length(4, "กรุณากรอกเลขท้ายเบอร์โทรศัพท์ 4 หลัก"),
  signData: signOrderSchema,
});

const publicActionSchema = z.discriminatedUnion("action", [
  verifyPhoneBodySchema,
  signRemoteBodySchema,
]);

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  try {
    const { token } = await context.params;
    const order = await getHandoverOrderByToken(token);
    if (!order) {
      return NextResponse.json({ error: "ไม่พบลิงก์เอกสารนี้" }, { status: 404 });
    }
    return NextResponse.json({
      summary: {
        docNumber: order.docNumber,
        branchName: order.branch.name,
        customerName: order.customerName,
        licensePlate: order.licensePlate,
        vehicleBrandModel: order.vehicleBrandModel,
        status: order.status,
        maskedPhone: order.customerPhone.replace(/.(?=.{4})/g, "*"),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  try {
    const { token } = await context.params;
    const order = await getHandoverOrderByToken(token);
    if (!order) {
      return NextResponse.json({ error: "ไม่พบลิงก์เอกสารนี้" }, { status: 404 });
    }

    const body: unknown = await req.json();
    const parsed = publicActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (!verifyCustomerPhoneLast4(order.customerPhone, parsed.data.phoneLast4)) {
      return NextResponse.json(
        { error: "เลขท้ายเบอร์โทรศัพท์ 4 หลักไม่ถูกต้อง" },
        { status: 403 }
      );
    }

    if (parsed.data.action === "VERIFY_PHONE") {
      return NextResponse.json({ order });
    }

    if (parsed.data.signData.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "ลิงก์นี้อนุญาตเฉพาะลูกค้าลงนามเท่านั้น" },
        { status: 403 }
      );
    }

    const updated = await recordOrderSignature(order.id, parsed.data.signData);
    return NextResponse.json({ order: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถลงนามได้";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
