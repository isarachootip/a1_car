import { NextRequest, NextResponse } from "next/server";
import { recordOrderSignature } from "@/lib/repositories/handoverRepository";
import { signOrderSchema } from "@/lib/validations/handoverSchema";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body: unknown = await req.json();
    const parsed = signOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลลายเซ็นไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const order = await recordOrderSignature(id, parsed.data);
    return NextResponse.json({ order });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถบันทึกลายเซ็นได้";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
