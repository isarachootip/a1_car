"use client";

import React from "react";
import { formatThaiDate } from "@/lib/domain/docNumber";
import { FuelLevel, HandoverOrderDTO } from "@/lib/types/handover";
import { Auto1PdfBodyAndSignatures } from "./Auto1PdfBodyAndSignatures";

const PICKUP_FUELS: Array<{ key: FuelLevel; label: string }> = [
  { key: "1/4", label: "1/4" },
  { key: "1/2", label: "1/2" },
  { key: "3/4", label: "3/4" },
  { key: "FULL", label: "เต็มถัง" },
];

export function Auto1PdfDocument({ order }: { order: HandoverOrderDTO }) {
  const totalPages = order.photos.length > 0 ? 2 : 1;

  return (
    <div className="bg-white text-slate-900 max-w-[210mm] mx-auto p-6 md:p-8 border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-3 text-[11.5px] leading-snug">
      {/* Header matching AUTO1 PDF */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 font-black px-3 py-1 rounded text-xl tracking-tight">
            <span>AUTO</span>
            <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded text-lg">
              1
            </span>
          </div>
          <p className="font-bold text-[12px] text-slate-900">
            ศูนย์บริการรถยนต์ในเครือเซ็นทรัลรีเทล
          </p>
          <p className="text-[11px]">
            <b>ศูนย์บริการสาขา:</b>{" "}
            <span className="border-b border-dotted border-slate-500 px-2">
              {order.branch.name}
            </span>
          </p>
          <p className="text-[11px]">
            <b>โทรศัพท์:</b>{" "}
            <span className="border-b border-dotted border-slate-500 px-2">
              {order.branch.phone}
            </span>{" "}
            | <b>เจ้าหน้าที่ผู้ติดต่อ:</b>{" "}
            <span className="border-b border-dotted border-slate-500 px-2">
              {order.staff.name}
            </span>
          </p>
        </div>

        <div className="text-right">
          <h1 className="text-lg font-extrabold text-slate-900">
            ใบรับ - ส่งมอบรถยนต์
          </h1>
          <p className="text-[11px] font-bold text-slate-700 mb-1.5">
            (บริการนอกสถานที่ / Pick-up & Delivery)
          </p>
          <div className="inline-block bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-left text-[11px] min-w-[205px]">
            <div className="flex justify-between gap-2">
              <b>เลขที่เอกสาร:</b>
              <span className="font-mono font-bold">{order.docNumber}</span>
            </div>
            <div className="flex justify-between gap-2 mt-0.5">
              <b>วันที่:</b>
              <span>{formatThaiDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mt-2.5">
        <div className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-[12px] text-slate-900 mb-1.5">
          1. ข้อมูลลูกค้าและข้อมูลรถยนต์ (CUSTOMER & VEHICLE INFORMATION)
        </div>

        <div className="grid grid-cols-12 gap-y-1.5 gap-x-3 text-[11px]">
          <div className="col-span-7 flex">
            <b className="shrink-0 mr-1.5">ชื่อ-นามสกุล ลูกค้า:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium">
              {order.customerName}
            </span>
          </div>
          <div className="col-span-5 flex">
            <b className="shrink-0 mr-1.5">เบอร์โทรศัพท์ติดต่อ:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium">
              {order.customerPhone}
            </span>
          </div>

          <div className="col-span-5 flex">
            <b className="shrink-0 mr-1.5">ยี่ห้อ / รุ่นรถยนต์:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium">
              {order.vehicleBrandModel}
            </span>
          </div>
          <div className="col-span-4 flex">
            <b className="shrink-0 mr-1.5">ทะเบียนรถ / จังหวัด:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium">
              {order.licensePlate}
            </span>
          </div>
          <div className="col-span-3 flex">
            <b className="shrink-0 mr-1.5">สีรถ:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium">
              {order.vehicleColor}
            </span>
          </div>

          <div className="col-span-5 flex">
            <b className="shrink-0 mr-1.5">เลขไมล์ก่อนรับรถ:</b>
            <span className="flex-1 border-b border-dotted border-slate-500 px-1 font-medium text-center">
              {order.pickupMileage.toLocaleString()}
            </span>
            <span className="ml-1">กม.</span>
          </div>
          <div className="col-span-7 flex items-center flex-wrap gap-2">
            <b>ระดับน้ำมัน/แบตเตอรี่:</b>
            {PICKUP_FUELS.map((f) => (
              <span key={f.key}>
                {order.pickupFuelLevel === f.key ? "☑" : "☐"} {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mt-2.5">
        <div className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-[12px] text-slate-900 mb-1.5">
          2. รายการแจ้งซ่อม / บริการที่ต้องการ (SERVICE REQUESTED)
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] mb-1">
          <span>
            {order.serviceStandard ? "☑" : "☐"} เช็กระยะตามมาตรฐาน
          </span>
          <span>
            {order.serviceOilFluid ? "☑" : "☐"} เปลี่ยนถ่ายน้ำมันเครื่อง/ของเหลว
          </span>
          <span>
            {order.serviceTireAlignment ? "☑" : "☐"} เปลี่ยนยาง/ตั้งศูนย์ถ่วงล้อ
          </span>
          <span>
            {order.serviceBrakeSuspension ? "☑" : "☐"} ระบบเบรก/ช่วงล่าง
          </span>
        </div>
        <div className="flex text-[11px]">
          <b className="shrink-0 mr-1.5">รายการเพิ่มเติม/อาการแจ้งซ่อม:</b>
          <span className="flex-1 border-b border-dotted border-slate-500 px-1">
            {order.serviceAdditionalNote || "-"}
          </span>
        </div>
      </div>

      <Auto1PdfBodyAndSignatures order={order} />

      {/* Footer */}
      <div className="mt-3 pt-1.5 border-t border-slate-300 flex justify-between text-[10px] text-slate-500">
        <span>
          AUTO1 - เอกสารใบรับ-ส่งมอบรถยนต์นอกสถานที่ (สำหรับใช้งานภายในและส่งมอบลูกค้า)
        </span>
        <span>หน้าที่ 1 จาก {totalPages}</span>
      </div>
    </div>
  );
}
