"use client";

import React from "react";
import { CustomerVehicleFields } from "./CustomerVehicleSection";

interface ServiceRequestedSectionProps {
  values: CustomerVehicleFields;
  disabled: boolean;
  onChange: <K extends keyof CustomerVehicleFields>(
    key: K,
    val: CustomerVehicleFields[K]
  ) => void;
}

const SERVICE_ITEMS = [
  { key: "serviceStandard" as const, label: "เช็กระยะตามมาตรฐาน" },
  { key: "serviceOilFluid" as const, label: "เปลี่ยนถ่ายน้ำมันเครื่อง/ของเหลว" },
  { key: "serviceTireAlignment" as const, label: "เปลี่ยนยาง/ตั้งศูนย์ถ่วงล้อ" },
  { key: "serviceBrakeSuspension" as const, label: "ระบบเบรก/ช่วงล่าง" },
];

export function ServiceRequestedSection({
  values,
  disabled,
  onChange,
}: ServiceRequestedSectionProps) {
  return (
    <section className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 border-l-4 border-slate-900 pl-3 py-1 bg-slate-100 rounded-r mb-4">
        2. รายการแจ้งซ่อม / บริการที่ต้องการ (SERVICE REQUESTED)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        {SERVICE_ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              disabled={disabled}
              checked={values[item.key]}
              onChange={(e) => onChange(item.key, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <span className="font-medium text-slate-800">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 text-sm">
        <label className="block font-semibold text-slate-700 mb-1">
          รายการเพิ่มเติม / อาการแจ้งซ่อม:
        </label>
        <input
          type="text"
          disabled={disabled}
          value={values.serviceAdditionalNote}
          onChange={(e) => onChange("serviceAdditionalNote", e.target.value)}
          placeholder="ระบุอาการแจ้งซ่อมหรือบริการอื่นๆ เพิ่มเติม (ถ้ามี)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
        />
      </div>
    </section>
  );
}
