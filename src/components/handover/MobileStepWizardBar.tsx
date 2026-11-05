"use client";

import React from "react";
import {
  UserCheck,
  CarFront,
  Camera,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

export type MobileWizardStep = 1 | 2 | 3 | 4;

interface MobileStepWizardBarProps {
  activeStep: MobileWizardStep;
  photoCount: number;
  damageCount: number;
  canSavePickup: boolean;
  saving: boolean;
  onSelectStep: (step: MobileWizardStep) => void;
  onSavePickup: () => void;
}

const STEPS: Array<{
  step: MobileWizardStep;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { step: 1, title: "1. ข้อมูล/นัดหมาย", icon: UserCheck },
  { step: 2, title: "2. ผังรอย/ทรัพย์สิน", icon: CarFront },
  { step: 3, title: "3. ถ่ายรูปรถ", icon: Camera },
  { step: 4, title: "4. เซ็นชื่อ/แชร์", icon: PenTool },
];

export function MobileStepTopTabs({
  activeStep,
  photoCount,
  damageCount,
  onSelectStep,
}: Pick<
  MobileStepWizardBarProps,
  "activeStep" | "photoCount" | "damageCount" | "onSelectStep"
>) {
  return (
    <div className="no-print bg-white border border-slate-300 rounded-xl p-2 mb-4 shadow-sm sticky top-2 z-30">
      <div className="grid grid-cols-4 gap-1.5">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCurrent = activeStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectStep(s.step)}
              className={`py-2 px-1.5 rounded-lg text-[11px] sm:text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition ${
                isCurrent
                  ? "bg-slate-900 text-amber-400 shadow"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full">{s.title}</span>
              {s.step === 2 && damageCount > 0 && (
                <span className="text-[10px] px-1.5 rounded-full bg-red-100 text-red-700">
                  {damageCount} จุด
                </span>
              )}
              {s.step === 3 && (
                <span
                  className={`text-[10px] px-1.5 rounded-full ${
                    photoCount >= 5
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {photoCount}/5 รูป
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MobileStickyBottomBar({
  activeStep,
  canSavePickup,
  saving,
  onSelectStep,
  onSavePickup,
}: Pick<
  MobileStepWizardBarProps,
  "activeStep" | "canSavePickup" | "saving" | "onSelectStep" | "onSavePickup"
>) {
  return (
    <div className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-300 px-3 py-2.5 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={activeStep === 1}
          onClick={() =>
            onSelectStep(Math.max(1, activeStep - 1) as MobileWizardStep)
          }
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> ก่อนหน้า
        </button>

        {canSavePickup && (
          <button
            type="button"
            disabled={saving}
            onClick={onSavePickup}
            className="flex-1 max-w-[220px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        )}

        <button
          type="button"
          disabled={activeStep === 4}
          onClick={() =>
            onSelectStep(Math.min(4, activeStep + 1) as MobileWizardStep)
          }
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-extrabold inline-flex items-center gap-1 disabled:opacity-40 shadow-sm"
        >
          ถัดไป <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
