"use client";

import React, { useState } from "react";
import {
  DAMAGE_TYPE_LABELS,
  DamageMarkRecord,
  DamageType,
  DamageZone,
  HandoverPhase,
} from "@/lib/types/handover";

interface BodyDiagramEditorProps {
  marks: DamageMarkRecord[];
  activePhase: HandoverPhase;
  disabled: boolean;
  onAddMark: (mark: DamageMarkRecord) => void;
  onRemoveMark: (index: number) => void;
}

const ZONES: Array<{
  zone: DamageZone;
  titleTh: string;
  titleEn: string;
  gridClass: string;
}> = [
  {
    zone: "FRONT",
    titleTh: "ด้านหน้า",
    titleEn: "(FRONT)",
    gridClass: "col-start-2 row-start-1",
  },
  {
    zone: "LEFT",
    titleTh: "ข้างซ้าย",
    titleEn: "(LEFT)",
    gridClass: "col-start-1 row-start-2",
  },
  {
    zone: "VEHICLE",
    titleTh: "ตัวรถยนต์",
    titleEn: "(VEHICLE)",
    gridClass: "col-start-2 row-start-2 bg-slate-100",
  },
  {
    zone: "RIGHT",
    titleTh: "ข้างขวา",
    titleEn: "(RIGHT)",
    gridClass: "col-start-3 row-start-2",
  },
  {
    zone: "REAR",
    titleTh: "ด้านหลัง",
    titleEn: "(REAR)",
    gridClass: "col-start-2 row-start-3",
  },
];

export function BodyDiagramEditor({
  marks,
  activePhase,
  disabled,
  onAddMark,
  onRemoveMark,
}: BodyDiagramEditorProps) {
  const [selectedType, setSelectedType] = useState<DamageType>("R");

  const handleZoneClick = (
    zone: DamageZone,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (disabled) return;
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

  return (
    <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-center font-bold text-slate-900 text-sm mb-2">
          แผนผังบันทึกรอยตัวถังภายนอก ({activePhase === "PICKUP" ? "ขารับรถ" : "ขาส่งคืน"})
        </h3>

        {!disabled && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {(Object.keys(DAMAGE_TYPE_LABELS) as DamageType[]).map((t) => {
              const info = DAMAGE_TYPE_LABELS[t];
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold border transition ${
                    isSelected
                      ? `${info.colorClass} border-slate-900 ring-2 ring-slate-900/20`
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {info.code} = {info.label}
                </button>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mb-3">
          {disabled
            ? "แผนผังถูกล็อกแล้ว"
            : "คลิกเลือกประเภทแผลด้านบน แล้วจิ้มตำแหน่งบนผังรถเพื่อปักหมุด (คลิกที่จุดหมุดเพื่อลบ)"}
        </p>

        {/* 3x3 Cross Vehicle Diagram matching PDF */}
        <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-[360px] mx-auto aspect-[4/3]">
          {ZONES.map((z) => {
            const zoneMarks = marks
              .map((m, idx) => ({ ...m, originalIndex: idx }))
              .filter((m) => m.zone === z.zone);

            return (
              <div
                key={z.zone}
                onClick={(e) => handleZoneClick(z.zone, e)}
                className={`${z.gridClass} relative border border-dashed border-slate-400 rounded-lg bg-white flex flex-col items-center justify-center select-none ${
                  disabled ? "cursor-default" : "cursor-crosshair hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold text-slate-700 pointer-events-none">
                  {z.titleTh}
                </span>
                <span className="text-[10px] text-slate-500 pointer-events-none">
                  {z.titleEn}
                </span>

                {zoneMarks.map((m) => {
                  const badge = DAMAGE_TYPE_LABELS[m.type];
                  return (
                    <button
                      key={`${m.zone}-${m.originalIndex}`}
                      type="button"
                      disabled={disabled}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (!disabled) onRemoveMark(m.originalIndex);
                      }}
                      style={{ left: `${m.posX}%`, top: `${m.posY}%` }}
                      title={`${badge.code}: ${badge.label} (คลิกเพื่อลบ)`}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute w-6 h-6 rounded-full text-[11px] font-extrabold shadow flex items-center justify-center border border-white ${badge.colorClass}`}
                    >
                      {m.type}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-200 text-center text-xs text-slate-700 font-medium flex flex-wrap justify-center gap-3">
        <span><b>R</b> = รอยขีดข่วน</span>
        <span><b>D</b> = รอยบุบ</span>
        <span><b>C</b> = รอยแตกร้าว</span>
        <span><b>S</b> = คราบแน่น/สนิม</span>
      </div>
    </div>
  );
}
