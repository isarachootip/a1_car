"use client";

import React from "react";
import { Camera, CheckCircle2, Trash2, Sparkles } from "lucide-react";
import { formatThaiDate, formatThaiTime } from "@/lib/domain/docNumber";
import {
  PHOTO_CATEGORY_LABELS,
  PhotoCategory,
  REQUIRED_PHOTO_CATEGORIES,
  VehiclePhotoRecord,
} from "@/lib/types/handover";

interface PhotoCategoryCardProps {
  category: PhotoCategory;
  photos: VehiclePhotoRecord[];
  disabled: boolean;
  isUploading: boolean;
  onFileSelect: (file: File | undefined) => void;
  onDemoPhoto: () => void;
  onDeletePhoto: (photoId: string) => void;
}

export function PhotoCategoryCard({
  category,
  photos,
  disabled,
  isUploading,
  onFileSelect,
  onDemoPhoto,
  onDeletePhoto,
}: PhotoCategoryCardProps) {
  const isRequired = REQUIRED_PHOTO_CATEGORIES.includes(category);
  const isDone = photos.length > 0;

  return (
    <div
      className={`border rounded-xl p-3 flex flex-col justify-between ${
        isDone
          ? "border-emerald-300 bg-emerald-50/20"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-800">
            {PHOTO_CATEGORY_LABELS[category]}
            {isRequired && <span className="text-red-600 ml-1">*</span>}
          </span>
          {isDone && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
        </div>

        {photos.length > 0 ? (
          <div className="space-y-2 mb-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="relative group rounded-lg overflow-hidden border border-slate-300 bg-black"
              >
                <img
                  src={p.fileUrl}
                  alt={p.caption}
                  className="w-full h-36 object-cover"
                />
                <div className="bg-slate-900/80 text-white text-[10px] px-2 py-1 flex justify-between items-center">
                  <span>
                    {formatThaiDate(p.takenAt)} {formatThaiTime(p.takenAt)} น.
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onDeletePhoto(p.id)}
                      className="text-red-300 hover:text-red-100 inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mb-3 bg-white">
            ยังไม่มีรูปถ่ายมุมนี้
          </div>
        )}
      </div>

      {!disabled && (
        <div className="flex items-center gap-2">
          <label className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg inline-flex items-center justify-center gap-1.5 transition">
            <Camera className="w-3.5 h-3.5" />
            <span>{isUploading ? "กำลังประมวลผล..." : "ถ่ายรูป / เลือกรูป"}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={isUploading}
              onChange={(e) => onFileSelect(e.target.files?.[0])}
              className="hidden"
            />
          </label>
          <button
            type="button"
            disabled={isUploading}
            onClick={onDemoPhoto}
            title="สร้างรูปจำลองสำหรับทดสอบบนคอมพิวเตอร์"
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold py-2 px-2.5 rounded-lg inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            จำลอง
          </button>
        </div>
      )}
    </div>
  );
}
