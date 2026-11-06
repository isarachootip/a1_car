"use client";

import React, { useState } from "react";
import { Camera } from "lucide-react";
import { getMissingRequiredPhotoCategories } from "@/lib/domain/handoverRules";
import {
  HandoverPhase,
  PHOTO_CATEGORY_LABELS,
  PhotoCategory,
  REQUIRED_PHOTO_CATEGORIES,
  VehiclePhotoRecord,
} from "@/lib/types/handover";
import {
  compressAndWatermarkImage,
  generateDemoVehiclePhotoDataUrl,
} from "@/lib/utils/imageWatermark";
import { PhotoCategoryCard } from "./PhotoCategoryCard";
import { LiveCameraModal } from "./LiveCameraModal";

interface PhotoCaptureGridProps {
  docNumber: string;
  phase: HandoverPhase;
  photos: VehiclePhotoRecord[];
  disabled: boolean;
  onUploadPhoto: (payload: {
    phase: HandoverPhase;
    category: PhotoCategory;
    dataUrl: string;
    caption: string;
  }) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
}

const ALL_CATEGORIES: PhotoCategory[] = [
  ...REQUIRED_PHOTO_CATEGORIES,
  "DAMAGE_EXTRA",
];

export function PhotoCaptureGrid({
  docNumber,
  phase,
  photos,
  disabled,
  onUploadPhoto,
  onDeletePhoto,
}: PhotoCaptureGridProps) {
  const [uploadingCat, setUploadingCat] = useState<PhotoCategory | null>(null);
  const [liveCameraCat, setLiveCameraCat] = useState<PhotoCategory | null>(null);
  const phasePhotos = photos.filter((p) => p.phase === phase);
  const missingCats = getMissingRequiredPhotoCategories(phasePhotos, phase);
  const nextGuidedCat = missingCats[0] ?? null;

  const handleFileSelect = async (
    category: PhotoCategory,
    file: File | undefined
  ) => {
    if (!file || disabled) return;
    setUploadingCat(category);
    try {
      const dataUrl = await compressAndWatermarkImage(file, {
        docNumber,
        phase,
        category,
      });
      await onUploadPhoto({
        phase,
        category,
        dataUrl,
        caption: PHOTO_CATEGORY_LABELS[category],
      });
    } finally {
      setUploadingCat(null);
    }
  };

  const handleDemoPhoto = async (category: PhotoCategory) => {
    if (disabled) return;
    setUploadingCat(category);
    try {
      const dataUrl = generateDemoVehiclePhotoDataUrl({
        docNumber,
        phase,
        category,
      });
      await onUploadPhoto({
        phase,
        category,
        dataUrl,
        caption: `${PHOTO_CATEGORY_LABELS[category]} (ภาพจำลอง)`,
      });
    } finally {
      setUploadingCat(null);
    }
  };

  return (
    <section className="bg-white border border-slate-300 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            📸 บันทึกรูปถ่ายสภาพรถยนต์ ({phase === "PICKUP" ? "ขารับรถ" : "ขาส่งคืนรถ"})
          </h3>
          <p className="text-xs text-slate-500">
            กด &ldquo;กล้องสด&rdquo; เพื่อเปิดหน้าจอกล้องถ่ายรูปพร้อมกรอบเล็ง หรือกด &ldquo;คลังภาพ&rdquo; เพื่อเลือกไฟล์รูปในเครื่อง
          </p>
        </div>
        <div
          className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
            missingCats.length === 0
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-amber-50 text-amber-800 border-amber-300"
          }`}
        >
          {missingCats.length === 0
            ? "✅ ถ่ายรูปบังคับครบ 5 มุมแล้ว"
            : `⚠️ รอถ่ายอีก ${missingCats.length} มุมบังคับ`}
        </div>
      </div>

      {!disabled && nextGuidedCat && (
        <div className="mb-4 bg-slate-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase">
              🚀 โหมดถ่ายต่อเนื่องอัตโนมัติ (มุมที่ {6 - missingCats.length} จาก 5)
            </span>
            <p className="text-sm font-extrabold">
              มุมถัดไป: {PHOTO_CATEGORY_LABELS[nextGuidedCat]}
            </p>
          </div>
          <button
            type="button"
            disabled={uploadingCat !== null}
            onClick={() => setLiveCameraCat(nextGuidedCat)}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-2 shadow"
          >
            <Camera className="w-4 h-4" />
            <span>
              {uploadingCat === nextGuidedCat
                ? "กำลังบันทึกรูป..."
                : `เปิดกล้องสดถ่าย "${PHOTO_CATEGORY_LABELS[nextGuidedCat]}" ทันที`}
            </span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_CATEGORIES.map((cat) => (
          <PhotoCategoryCard
            key={cat}
            category={cat}
            photos={phasePhotos.filter((p) => p.category === cat)}
            disabled={disabled}
            isUploading={uploadingCat === cat}
            isNextGuided={nextGuidedCat === cat}
            onOpenLiveCamera={() => setLiveCameraCat(cat)}
            onFileSelect={(f) => handleFileSelect(cat, f)}
            onDemoPhoto={() => handleDemoPhoto(cat)}
            onDeletePhoto={onDeletePhoto}
          />
        ))}
      </div>

      <LiveCameraModal
        open={liveCameraCat !== null}
        docNumber={docNumber}
        phase={phase}
        category={liveCameraCat}
        onClose={() => setLiveCameraCat(null)}
        onCaptureFile={handleFileSelect}
        onFallbackDemo={handleDemoPhoto}
      />
    </section>
  );
}
