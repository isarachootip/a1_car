"use client";

import React from "react";
import { Camera, Image as ImageIcon, CheckCircle2, Trash2, Sparkles } from "lucide-react";
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
  isNextGuided: boolean;
  onOpenLiveCamera: () => void;
  onFileSelect: (file: File | undefined) => void;
  onDemoPhoto: () => void;
  onDeletePhoto: (photoId: string) => void;
}

export function PhotoCategoryCard({
  category,
  photos,
  disabled,
  isUploading,
  isNextGuided,
  onOpenLiveCamera,
  onFileSelect,
  onDemoPhoto,
  onDeletePhoto,
}: PhotoCategoryCardProps) {
  const isRequired = REQUIRED_PHOTO_CATEGORIES.includes(category);
  const isDone = photos.length > 0;

  return (
    <div
      className={`border rounded-xl p-3 flex flex-col justify-between transition ${
        isDone
          ? "border-emerald-300 bg-emerald-50/20"
          : isNextGuided
            ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/30"
            : "border-slate-200 bg-slate-50"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-800">
            {PHOTO_CATEGORY_LABELS[category]}
            {isRequired && <span className="text-red-600 ml-1">*</span>}
          </span>
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : isNextGuided ? (
            <span className="text-[10px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
              มุมถัดไป
            </span>
          ) : null}
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
                      className="text-red-300 hover:text-red-100 inline-flex items-center gap-0.5 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-28 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mb-3 bg-white">
            ยังไม่มีรูปถ่ายมุมนี้
          </div>
        )}
      </div>

      {!disabled && (
        <div className="grid grid-cols-5 gap-1.5">
          {/* Open In-App WebRTC Live Camera Viewfinder Modal */}
          <button
            type="button"
            disabled={isUploading}
            onClick={onOpenLiveCamera}
            className="col-span-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-2 rounded-lg inline-flex items-center justify-center gap-1 transition"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{isUploading ? "รอ..." : "กล้องสด"}</span>
          </button>

          {/* Gallery / File Picker Button (For Saved Photos) */}
          <label className="col-span-2 cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2.5 px-2 rounded-lg inline-flex items-center justify-center gap-1 transition">
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">คลังภาพ</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => onFileSelect(e.target.files?.[0])}
              className="hidden"
            />
          </label>

          <button
            type="button"
            disabled={isUploading}
            onClick={onDemoPhoto}
            title="จำลองรูปถ่าย"
            className="col-span-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold py-2.5 rounded-lg inline-flex items-center justify-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
