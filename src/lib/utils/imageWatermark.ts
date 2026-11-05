import { formatThaiDate, formatThaiTime } from "../domain/docNumber";
import {
  HandoverPhase,
  PHOTO_CATEGORY_LABELS,
  PhotoCategory,
} from "../types/handover";

export interface WatermarkOptions {
  docNumber: string;
  phase: HandoverPhase;
  category: PhotoCategory;
  maxDimension?: number;
  quality?: number;
}

export async function compressAndWatermarkImage(
  file: File,
  options: WatermarkOptions
): Promise<string> {
  const maxDim = options.maxDimension ?? 1600;
  const quality = options.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;

  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("ไม่รองรับการประมวลผลภาพบนเบราว์เซอร์นี้");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  drawWatermarkBanner(ctx, width, height, options);

  return canvas.toDataURL("image/jpeg", quality);
}

export function generateDemoVehiclePhotoDataUrl(
  options: WatermarkOptions
): string {
  const width = 960;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 130);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `ภาพถ่ายรถยนต์: ${PHOTO_CATEGORY_LABELS[options.category]}`,
    width / 2,
    height / 2 - 30
  );

  ctx.fillStyle = "#334155";
  ctx.font = "24px sans-serif";
  ctx.fillText(
    `เอกสารเลขที่ ${options.docNumber} (${options.phase === "PICKUP" ? "ขารับรถ" : "ขาส่งคืนรถ"})`,
    width / 2,
    height / 2 + 20
  );

  drawWatermarkBanner(ctx, width, height, options);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function drawWatermarkBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: WatermarkOptions
): void {
  const now = new Date();
  const barHeight = Math.max(44, Math.round(height * 0.075));
  ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
  ctx.fillRect(0, height - barHeight, width, barHeight);

  const fontSize = Math.max(14, Math.round(barHeight * 0.38));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const phaseLabel = options.phase === "PICKUP" ? "รับรถ (Pick-up)" : "ส่งคืน (Delivery)";
  const text = `AUTO1 | ${options.docNumber} | ${phaseLabel} | ${PHOTO_CATEGORY_LABELS[options.category]} | ${formatThaiDate(now)} ${formatThaiTime(now)} น.`;
  ctx.fillText(text, 16, height - barHeight / 2);
}
