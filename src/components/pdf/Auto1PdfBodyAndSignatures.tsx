"use client";

import React from "react";
import {
  DAMAGE_TYPE_LABELS,
  DamageZone,
  HandoverOrderDTO,
} from "@/lib/types/handover";
import { AUTO1_TERMS_LIST } from "../handover/TermsSection";
import { Auto1PdfSignaturesSection } from "./Auto1PdfSignaturesSection";

const DIAGRAM_ZONES: Array<{
  zone: DamageZone;
  th: string;
  en: string;
  posClass: string;
}> = [
  { zone: "FRONT", th: "ด้านหน้า", en: "(FRONT)", posClass: "col-start-2 row-start-1" },
  { zone: "LEFT", th: "ข้างซ้าย", en: "(LEFT)", posClass: "col-start-1 row-start-2" },
  { zone: "VEHICLE", th: "ตัวรถยนต์", en: "(VEHICLE)", posClass: "col-start-2 row-start-2 bg-slate-200/70" },
  { zone: "RIGHT", th: "ข้างขวา", en: "(RIGHT)", posClass: "col-start-3 row-start-2" },
  { zone: "REAR", th: "ด้านหลัง", en: "(REAR)", posClass: "col-start-2 row-start-3" },
];

export function Auto1PdfBodyAndSignatures({
  order,
}: {
  order: HandoverOrderDTO;
}) {
  return (
    <>
      {/* Section 3 */}
      <div className="mt-2.5">
        <div className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-[12px] text-slate-900 mb-1.5">
          3. ตรวจสอบสภาพตัวถังและทรัพย์สินภายในรถ (BODY CONDITION & INVENTORY CHECK)
        </div>

        <div className="grid grid-cols-12 gap-2">
          {/* Diagram Left */}
          <div className="col-span-6 border border-slate-300 rounded p-2 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <p className="text-center font-bold text-[11px] text-slate-900 mb-1.5">
                แผนผังบันทึกรอยตัวถังภายนอก
              </p>
              <div className="grid grid-cols-3 grid-rows-3 gap-1.5 h-[145px] max-w-[300px] mx-auto">
                {DIAGRAM_ZONES.map((z) => {
                  const zMarks = order.damageMarks.filter((m) => m.zone === z.zone);
                  return (
                    <div
                      key={z.zone}
                      className={`${z.posClass} relative border border-dashed border-slate-400 rounded bg-white flex flex-col items-center justify-center text-center`}
                    >
                      <span className="text-[10px] font-bold text-slate-800 leading-tight">
                        {z.th} {z.en}
                      </span>
                      {zMarks.map((m, idx) => (
                        <span
                          key={`${z.zone}-${idx}`}
                          style={{ left: `${m.posX}%`, top: `${m.posY}%` }}
                          className={`-translate-x-1/2 -translate-y-1/2 absolute w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white ${DAMAGE_TYPE_LABELS[m.type].colorClass}`}
                        >
                          {m.type}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-[10px] text-center text-slate-800 pt-1.5 border-t border-slate-200 mt-1.5">
              <b>R</b> = รอยขีดข่วน &nbsp; <b>D</b> = รอยบุบ &nbsp; <b>C</b> = รอยแตกร้าว &nbsp; <b>S</b> = คราบแน่น/สนิม
            </div>
          </div>

          {/* Inventory Right */}
          <div className="col-span-6 border border-slate-300 rounded overflow-hidden flex flex-col justify-between text-[11px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="py-1 px-2 text-left font-bold border-r border-slate-300">
                    รายการอุปกรณ์ / ทรัพย์สิน
                  </th>
                  <th className="py-1 px-2 text-center font-bold w-28">
                    ผลการตรวจสอบ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { label: "เอกสารประจำรถ / เล่มทะเบียน", val: order.invRegistrationBook },
                  { label: "กุญแจสำรอง / รีโมต", val: order.invSpareKeyRemote },
                  { label: "ยางอะไหล่ / แม่แรง / อุปกรณ์ฉุกเฉิน", val: order.invSpareTireJack },
                  { label: "กล้องติดรถยนต์ / บัตรทางด่วน", val: order.invDashcamTollCard },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-1 px-2 border-r border-slate-200">{row.label}</td>
                    <td className="py-1 px-2 text-center whitespace-nowrap">
                      <span className="mr-2">{row.val ? "☑" : "☐"} มี</span>
                      <span>{!row.val ? "☑" : "☐"} ไม่มี</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-2 border-t border-slate-200 text-[10px]">
              <p className="font-bold text-slate-900">ทรัพย์สินมีค่าอื่นๆ (ระบุ):</p>
              <p className="text-slate-500 text-[9px]">(เช่น พระเครื่อง, เครื่องประดับ, อุปกรณ์ไอที)</p>
              <div className="border-b border-dotted border-slate-400 min-h-[18px] font-medium text-slate-900 mt-0.5">
                {order.invOtherValuables || "-"}
              </div>
              <p className="text-[9px] text-slate-600 mt-1">
                * หากมิได้ระบุในช่องทรัพย์สินข้างต้น บริษัทขอสงวนสิทธิ์ไม่รับผิดชอบทุกกรณี
              </p>
            </div>
          </div>
        </div>

        <div className="mt-1.5 bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-[10.5px] text-slate-800">
          <b>📌 หมายเหตุค่าบริการ: ค่าบริการรับ-ส่งรถนอกสถานที่ 400 บาท</b> (ระยะทางไม่เกิน 20 กม. *เกิน 20 กม. คิดค่าบริการเพิ่มเติมตามอัตราที่บริษัทกำหนด จากศูนย์บริการ)
        </div>
      </div>

      {/* Section 4 */}
      <div className="mt-2.5">
        <div className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-[12px] text-slate-900 mb-1">
          4. เงื่อนไขความรับผิดชอบในการรับ-ส่งรถ (TERMS & CONDITIONS)
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[9.5px] leading-[1.35] text-slate-800 space-y-0.5">
          {AUTO1_TERMS_LIST.map((t) => (
            <p key={t.title}>
              <b>{t.title}</b> {t.body}
            </p>
          ))}
        </div>
      </div>

      <Auto1PdfSignaturesSection order={order} />
    </>
  );
}
