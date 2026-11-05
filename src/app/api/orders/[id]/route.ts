import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getHandoverOrderById,
  updateDeliveryOrderData,
  updatePickupOrderData,
} from "@/lib/repositories/handoverRepository";
import {
  updateDeliveryOrderSchema,
  updatePickupOrderSchema,
} from "@/lib/validations/handoverSchema";

const patchPayloadSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("PICKUP"),
    data: updatePickupOrderSchema,
  }),
  z.object({
    mode: z.literal("DELIVERY"),
    data: updateDeliveryOrderSchema,
  }),
]);

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const order = await getHandoverOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "ไม่พบใบงาน" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถดึงข้อมูลใบงานได้";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body: unknown = await req.json();
    const parsed = patchPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const order =
      parsed.data.mode === "PICKUP"
        ? await updatePickupOrderData(id, parsed.data.data)
        : await updateDeliveryOrderData(id, parsed.data.data);

    return NextResponse.json({ order });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถบันทึกข้อมูลใบงานได้";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
