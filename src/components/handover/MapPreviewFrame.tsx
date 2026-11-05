"use client";

import React from "react";
import { Navigation, AlertTriangle, CheckCircle2, Compass } from "lucide-react";
import { evaluateBranchDistance } from "@/lib/domain/geoCalculator";

interface MapPreviewFrameProps {
  lat: number;
  lng: number;
  branchCode?: string;
  disabled?: boolean;
  onNudgeCoord: (dLat: number, dLng: number) => void;
}

export function MapPreviewFrame({
  lat,
  lng,
  branchCode,
  disabled,
  onNudgeCoord,
}: MapPreviewFrameProps) {
  const distEval = evaluateBranchDistance(branchCode, lat, lng);
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="mt-2.5 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Distance & 20km Fee Rule Banner */}
      {distEval && (
        <div
          className={`px-3 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 border-b ${
            distEval.isOver20Km
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-emerald-50 text-emerald-900 border-emerald-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {distEval.isOver20Km ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>
              ระยะทางจากสาขาโดยประมาณ: <b>{distEval.distanceKm} กม.</b>{" "}
              {distEval.isOver20Km
                ? `(เกินเกณฑ์ 20 กม. อยู่ ${distEval.extraKm} กม. — มีค่าบริการเพิ่มเติมตามอัตราบริษัท)`
                : "(อยู่ในเกณฑ์ไม่เกิน 20 กม. — ค่าบริการ 400 บาท)"}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-600">
            พิกัด: {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        </div>
      )}

      {/* Embedded Google Map Preview */}
      <div className="relative w-full h-44 bg-slate-100">
        <iframe
          title="Google Maps Location Preview"
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Fine-tune Pin Adjustment Controls */}
      {!disabled && (
        <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="text-slate-600 font-semibold inline-flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            ขยับปรับจุดหมุดพิกัดละเอียด:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onNudgeCoord(0.0008, 0)}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
            >
              ⬆️ เหนือ
            </button>
            <button
              type="button"
              onClick={() => onNudgeCoord(-0.0008, 0)}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
            >
              ⬇️ ใต้
            </button>
            <button
              type="button"
              onClick={() => onNudgeCoord(0, -0.0008)}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
            >
              ⬅️ ซ้าย
            </button>
            <button
              type="button"
              onClick={() => onNudgeCoord(0, 0.0008)}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
            >
              ➡️ ขวา
            </button>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded bg-blue-600 text-white font-bold inline-flex items-center gap-1 ml-1"
            >
              <Navigation className="w-3 h-3" /> เปิดแอป Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
