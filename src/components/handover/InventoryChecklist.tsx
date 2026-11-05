"use client";

import React from "react";

export interface InventoryFields {
  invRegistrationBook: boolean;
  invSpareKeyRemote: boolean;
  invSpareTireJack: boolean;
  invDashcamTollCard: boolean;
  invOtherValuables: string;
}

interface InventoryChecklistProps {
  values: InventoryFields;
  disabled: boolean;
  onChange: <K extends keyof InventoryFields>(
    key: K,
    val: InventoryFields[K]
  ) => void;
}

const INVENTORY_ITEMS: Array<{
  key: keyof Omit<InventoryFields, "invOtherValuables">;
  label: string;
}> = [
  { key: "invRegistrationBook", label: "เอกสารประจำรถ / เล่มทะเบียน" },
  { key: "invSpareKeyRemote", label: "กุญแจสำรอง / รีโมต" },
  { key: "invSpareTireJack", label: "ยางอะไหล่ / แม่แรง / อุปกรณ์ฉุกเฉิน" },
  { key: "invDashcamTollCard", label: "กล้องติดรถยนต์ / บัตรทางด่วน" },
];

export function InventoryChecklist({
  values,
  disabled,
  onChange,
}: InventoryChecklistProps) {
  return (
    <div className="flex flex-col justify-between border border-slate-300 rounded-xl overflow-hidden bg-white">
      <div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
              <th className="py-2.5 px-3 text-left font-bold border-r border-slate-300">
                รายการอุปกรณ์ / ทรัพย์สิน
              </th>
              <th className="py-2.5 px-3 text-center font-bold w-36">
                ผลการตรวจสอบ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {INVENTORY_ITEMS.map((item) => {
              const hasItem = values[item.key];
              return (
                <tr key={item.key}>
                  <td className="py-2.5 px-3 text-slate-800 border-r border-slate-200 font-medium">
                    {item.label}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="inline-flex items-center gap-3">
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          disabled={disabled}
                          checked={hasItem === true}
                          onChange={() => onChange(item.key, true)}
                          className="text-slate-900"
                        />
                        <span>มี</span>
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          disabled={disabled}
                          checked={hasItem === false}
                          onChange={() => onChange(item.key, false)}
                          className="text-slate-900"
                        />
                        <span>ไม่มี</span>
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-3 border-t border-slate-200 text-sm">
          <label className="block font-bold text-slate-800">
            ทรัพย์สินมีค่าอื่นๆ (ระบุ):
          </label>
          <p className="text-xs text-slate-500 mb-1.5">
            (เช่น พระเครื่อง, เครื่องประดับ, อุปกรณ์ไอที)
          </p>
          <input
            type="text"
            disabled={disabled}
            value={values.invOtherValuables}
            onChange={(e) => onChange("invOtherValuables", e.target.value)}
            placeholder="ระบุทรัพย์สินมีค่าอื่นๆ หรือเว้นว่างหากไม่มี"
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:bg-slate-100"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            * หากมิได้ระบุในช่องทรัพย์สินข้างต้น บริษัทขอสงวนสิทธิ์ไม่รับผิดชอบทุกกรณี
          </p>
        </div>
      </div>

      <div className="bg-slate-100 border-t border-slate-300 p-3 text-xs text-slate-800">
        <span className="font-bold">📌 หมายเหตุค่าบริการ:</span>{" "}
        <span className="font-semibold">
          ค่าบริการรับ-ส่งรถนอกสถานที่ 400 บาท
        </span>{" "}
        (ระยะทางไม่เกิน 20 กม. *เกิน 20 กม. คิดค่าบริการเพิ่มเติมตามอัตราที่บริษัทกำหนด จากศูนย์บริการ)
      </div>
    </div>
  );
}
