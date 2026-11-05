"use client";

import React from "react";
import { X, Undo2 } from "lucide-react";
import {
  DAMAGE_TYPE_LABELS,
  DamageMarkRecord,
  DamageType,
  DamageZone,
  HandoverPhase,
} from "@/lib/types/handover";

interface ZoneZoomModalProps {
  zone: DamageZone | null;
  zoneTitle: string;
  activePhase: HandoverPhase;
  selectedType: DamageType;
  marks: DamageMarkRecord[];
  disabled: boolean;
  onSelectType: (t: DamageType) => void;
  onAddMark: (mark: DamageMarkRecord) => void;
  onRemoveMark: (index: number) => void;
  onClose: () => void;
}

export function ZoneZoomModal({
  zone,
  zoneTitle,
  activePhase,
  selectedType,
  marks,
  disabled,
  onSelectType,
  onAddMark,
  onRemoveMark,
  onClose,
}: ZoneZoomModalProps) {
  if (!zone) return null;

  const zoneMarks = marks
    .map((m, idx) => ({ ...m, originalIndex: idx }))
    .filter((m) => m.zone === zone);

  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const posX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const posY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onAddMark({
      phase: activePhase,
      zone,
      type: selectedType,
      posX: Math.max(6, Math.min(94, posX)),
      posY: Math.max(8, Math.min(92, posY)),
      note: `${DAMAGE_TYPE_LABELS[selectedType].label} (${zone})`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">
            🔍 ขยายจุดปักหมุดแผล: {zoneTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {(Object.keys(DAMAGE_TYPE_LABELS) as DamageType[]).map((t) => {
            const info = DAMAGE_TYPE_LABELS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => onSelectType(t)}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold border ${
                  selectedType === t
                    ? `${info.colorClass} border-slate-900 ring-2 ring-slate-900/20`
                    : "bg-slate-50 text-slate-700 border-slate-300"
                }`}
              >
                {info.code} = {info.label}
              </button>
            );
          })}
        </div>

        <div
          onClick={handleSurfaceClick}
          className="relative w-full h-64 border-2 border-dashed border-slate-400 rounded-2xl bg-slate-50 flex flex-col items-center justify-center select-none cursor-crosshair"
        >
          <span className="text-base font-extrabold text-slate-400 pointer-events-none">
            {zoneTitle}
          </span>
          <span className="text-xs text-slate-400 pointer-events-none mt-1">
            แตะพื้นที่นี้เพื่อปักหมุด ({selectedType}) • แตะที่หมุดเพื่อลบ
          </span>

          {zoneMarks.map((m) => (
            <button
              key={`zoom-${m.originalIndex}`}
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                if (!disabled) onRemoveMark(m.originalIndex);
              }}
              style={{ left: `${m.posX}%`, top: `${m.posY}%` }}
              className={`-translate-x-1/2 -translate-y-1/2 absolute w-8 h-8 rounded-full text-xs font-extrabold shadow-md flex items-center justify-center border-2 border-white ${DAMAGE_TYPE_LABELS[m.type].colorClass}`}
            >
              {m.type}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          {zoneMarks.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                onRemoveMark(zoneMarks[zoneMarks.length - 1].originalIndex)
              }
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 inline-flex items-center gap-1"
            >
              <Undo2 className="w-3.5 h-3.5" /> ลบจุดล่าสุดในโซนนี้
            </button>
          ) : (
            <span className="text-xs text-slate-400">ยังไม่มีจุดแผลในโซนนี้</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-amber-400 text-xs font-extrabold"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}
