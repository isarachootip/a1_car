import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  addOrderPhoto,
  deleteOrderPhoto,
} from "@/lib/repositories/handoverRepository";
import { uploadPhotoSchema } from "@/lib/validations/handoverSchema";

const deletePhotoQuerySchema = z.object({
  photoId: z.string().min(1, "กรุณาระบุรหัสรูปภาพ"),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body: unknown = await req.json();
    const parsed = uploadPhotoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลรูปภาพไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const order = await addOrderPhoto(id, {
      phase: parsed.data.phase,
      category: parsed.data.category,
      fileUrl: parsed.data.dataUrl,
      caption: parsed.data.caption,
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถอัปโหลดรูปภาพได้";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const photoId = req.nextUrl.searchParams.get("photoId") ?? "";
    const parsed = deletePhotoQuerySchema.safeParse({ photoId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "รหัสรูปภาพไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const order = await deleteOrderPhoto(id, parsed.data.photoId);
    return NextResponse.json({ order });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "ไม่สามารถลบรูปภาพได้";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
