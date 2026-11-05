"use client";

import React, { useState } from "react";
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
  const phasePhotos = photos.filter((p) => p.phase === phase);
  const missingCats = getMissingRequiredPhotoCategories(phasePhotos, phase);

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
    <section className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            📸 บันทึกรูปถ่ายสภาพรถยนต์ ({phase === "PICKUP" ? "ขารับรถจากลูกค้า" : "ขาส่งคืนรถลูกค้า"})
          </h3>
          <p className="text-xs text-slate-500">
            ระบบย่อขนาดภาพอัตโนมัติ (Full HD) และฝังลายน้ำวันเวลา/เลขเอกสารลงบนภาพทุกใบ
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
            : `⚠️ รอถ่ายรูปบังคับอีก ${missingCats.length} มุม`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_CATEGORIES.map((cat) => (
          <PhotoCategoryCard
            key={cat}
            category={cat}
            photos={phasePhotos.filter((p) => p.category === cat)}
            disabled={disabled}
            isUploading={uploadingCat === cat}
            onFileSelect={(f) => handleFileSelect(cat, f)}
            onDemoPhoto={() => handleDemoPhoto(cat)}
            onDeletePhoto={onDeletePhoto}
          />
        ))}
      </div>
    </section>
  );
}
