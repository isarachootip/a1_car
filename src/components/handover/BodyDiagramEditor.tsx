"use client";

import React, { useState } from "react";
import { Lock, Unlock, ZoomIn, Undo2 } from "lucide-react";
import {
  DAMAGE_TYPE_LABELS,
  DamageMarkRecord,
  DamageType,
  DamageZone,
  HandoverPhase,
} from "@/lib/types/handover";
import { ZoneZoomModal } from "./ZoneZoomModal";

interface BodyDiagramEditorProps {
  marks: DamageMarkRecord[];
  activePhase: HandoverPhase;
  disabled: boolean;
  onAddMark: (mark: DamageMarkRecord) => void;
  onRemoveMark: (index: number) => void;
}

const ZONES: Array<{ zone: DamageZone; titleTh: string; titleEn: string; gridClass: string }> = [
  { zone: "FRONT", titleTh: "ด้านหน้า", titleEn: "(FRONT)", gridClass: "col-start-2 row-start-1" },
  { zone: "LEFT", titleTh: "ข้างซ้าย", titleEn: "(LEFT)", gridClass: "col-start-1 row-start-2" },
  { zone: "VEHICLE", titleTh: "ตัวรถยนต์", titleEn: "(VEHICLE)", gridClass: "col-start-2 row-start-2 bg-slate-100" },
  { zone: "RIGHT", titleTh: "ข้างขวา", titleEn: "(RIGHT)", gridClass: "col-start-3 row-start-2" },
  { zone: "REAR", titleTh: "ด้านหลัง", titleEn: "(REAR)", gridClass: "col-start-2 row-start-3" },
];

export function BodyDiagramEditor({
  marks,
  activePhase,
  disabled,
  onAddMark,
  onRemoveMark,
}: BodyDiagramEditorProps) {
  const [selectedType, setSelectedType] = useState<DamageType>("R");
  const [touchUnlocked, setTouchUnlocked] = useState(true);
  const [zoomZone, setZoomZone] = useState<DamageZone | null>(null);

  const handleZoneClick = (zone: DamageZone, e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !touchUnlocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const posX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const posY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onAddMark({
      phase: activePhase,
      zone,
      type: selectedType,
      posX: Math.max(8, Math.min(92, posX)),
      posY: Math.max(12, Math.min(88, posY)),
      note: `${DAMAGE_TYPE_LABELS[selectedType].label} (${zone})`,
    });
  };

  const activeZoneMeta = ZONES.find((z) => z.zone === zoomZone);

  return (
    <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-900 text-sm">
            แผนผังบันทึกรอยตัวถัง ({activePhase === "PICKUP" ? "ขารับรถ" : "ขาส่งคืน"})
          </h3>
          {!disabled && (
            <div className="flex items-center gap-1.5">
              {marks.length > 0 && (
                <button type="button" onClick={() => onRemoveMark(marks.length - 1)} className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-slate-700 inline-flex items-center gap-1">
                  <Undo2 className="w-3 h-3" /> ลบจุดล่าสุด
                </button>
              )}
              <button type="button" onClick={() => setTouchUnlocked((v) => !v)} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border ${touchUnlocked ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-slate-200 text-slate-700 border-slate-300"}`}>
                {touchUnlocked ? <><Unlock className="w-3 h-3" /> จิ้มปักหมุดได้</> : <><Lock className="w-3 h-3" /> ล็อกกันนิ้วลั่น</>}
              </button>
            </div>
          )}
        </div>

        {!disabled && (
          <>
            <div className="grid grid-cols-2 sm:flex flex-wrap justify-center gap-1.5 mb-2.5">
              {(Object.keys(DAMAGE_TYPE_LABELS) as DamageType[]).map((t) => {
                const info = DAMAGE_TYPE_LABELS[t];
                return (
                  <button key={t} type="button" onClick={() => setSelectedType(t)} className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition ${selectedType === t ? `${info.colorClass} border-slate-900 ring-2 ring-slate-900/20` : "bg-white text-slate-700 border-slate-300"}`}>
                    {info.code} = {info.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1 mb-3">
              <span className="text-[11px] text-slate-500 mr-1">
                <ZoomIn className="w-3.5 h-3.5 inline mr-0.5" /> ซูมโซนสำหรับมือถือ:
              </span>
              {ZONES.map((z) => (
                <button key={z.zone} type="button" onClick={() => setZoomZone(z.zone)} className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-amber-50 text-slate-700">
                  {z.titleTh}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-[360px] mx-auto aspect-[4/3]">
          {ZONES.map((z) => {
            const zoneMarks = marks.map((m, idx) => ({ ...m, originalIndex: idx })).filter((m) => m.zone === z.zone);
            return (
              <div key={z.zone} onClick={(e) => handleZoneClick(z.zone, e)} className={`${z.gridClass} relative border border-dashed border-slate-400 rounded-lg bg-white flex flex-col items-center justify-center select-none ${disabled || !touchUnlocked ? "cursor-default" : "cursor-crosshair"}`}>
                <span className="text-xs font-bold text-slate-700 pointer-events-none">{z.titleTh}</span>
                <span className="text-[10px] text-slate-500 pointer-events-none">{z.titleEn}</span>
                {zoneMarks.map((m) => (
                  <button key={`${m.zone}-${m.originalIndex}`} type="button" disabled={disabled || !touchUnlocked} onClick={(ev) => { ev.stopPropagation(); if (!disabled && touchUnlocked) onRemoveMark(m.originalIndex); }} style={{ left: `${m.posX}%`, top: `${m.posY}%` }} className={`-translate-x-1/2 -translate-y-1/2 absolute w-6 h-6 rounded-full text-[11px] font-extrabold shadow flex items-center justify-center border border-white ${DAMAGE_TYPE_LABELS[m.type].colorClass}`}>
                    {m.type}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 text-center text-xs text-slate-700 font-medium flex flex-wrap justify-center gap-3">
        <span><b>R</b> = รอยขีดข่วน</span>
        <span><b>D</b> = รอยบุบ</span>
        <span><b>C</b> = รอยแตกร้าว</span>
        <span><b>S</b> = คราบแน่น/สนิม</span>
      </div>

      <ZoneZoomModal
        zone={zoomZone}
        zoneTitle={activeZoneMeta ? `${activeZoneMeta.titleTh} ${activeZoneMeta.titleEn}` : ""}
        activePhase={activePhase}
        selectedType={selectedType}
        marks={marks}
        disabled={disabled}
        onSelectType={setSelectedType}
        onAddMark={onAddMark}
        onRemoveMark={onRemoveMark}
        onClose={() => setZoomZone(null)}
      />
    </div>
  );
}
