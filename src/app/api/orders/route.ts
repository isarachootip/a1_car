import { NextRequest, NextResponse } from "next/server";
import {
  createHandoverOrder,
  listHandoverOrders,
} from "@/lib/repositories/handoverRepository";
import { createOrderSchema } from "@/lib/validations/handoverSchema";

export async function GET(): Promise<NextResponse> {
  try {
    const orders = await listHandoverOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถดึงรายการใบงานได้";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const order = await createHandoverOrder(parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถสร้างใบงานได้";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
