"use client";

import React from "react";
import { formatThaiDate, formatThaiTime } from "@/lib/domain/docNumber";
import {
  HandoverOrderDTO,
  PHOTO_CATEGORY_LABELS,
} from "@/lib/types/handover";

export function Auto1PdfPhotoPage({ order }: { order: HandoverOrderDTO }) {
  if (order.photos.length === 0) return null;

  const pickupPhotos = order.photos.filter((p) => p.phase === "PICKUP");
  const deliveryPhotos = order.photos.filter((p) => p.phase === "DELIVERY");

  return (
    <div className="bg-white text-slate-900 max-w-[210mm] mx-auto p-6 md:p-8 border border-slate-300 shadow-sm mt-6 print:mt-0 print:break-before-page print:shadow-none print:border-none print:p-3 text-[11.5px]">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            เอกสารแนบท้าย: ภาพถ่ายตรวจสอบสภาพรถยนต์ (PHOTO EVIDENCE)
          </h2>
          <p className="text-xs text-slate-600">
            อ้างอิงใบรับ-ส่งมอบรถยนต์เลขที่ <b>{order.docNumber}</b> | ทะเบียน:{" "}
            <b>{order.licensePlate}</b> | ลูกค้า: <b>{order.customerName}</b>
          </p>
        </div>
        <div className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded text-base">
          AUTO 1
        </div>
      </div>

      {pickupPhotos.length > 0 && (
        <div className="mb-5">
          <h3 className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-xs mb-2.5">
            ภาพถ่ายขั้นตอนที่ 1: การรับรถจากลูกค้า (Pick-up Photos)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pickupPhotos.map((p) => (
              <div
                key={p.id}
                className="border border-slate-300 rounded overflow-hidden bg-slate-50"
              >
                <img
                  src={p.fileUrl}
                  alt={p.caption}
                  className="w-full h-36 object-cover bg-black"
                />
                <div className="p-1.5 text-[10px]">
                  <p className="font-bold text-slate-900">
                    {PHOTO_CATEGORY_LABELS[p.category]}
                  </p>
                  <p className="text-slate-500">
                    บันทึกเมื่อ: {formatThaiDate(p.takenAt)}{" "}
                    {formatThaiTime(p.takenAt)} น.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deliveryPhotos.length > 0 && (
        <div className="mb-4">
          <h3 className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-xs mb-2.5">
            ภาพถ่ายขั้นตอนที่ 2: การส่งมอบรถคืนลูกค้า (Delivery Photos)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {deliveryPhotos.map((p) => (
              <div
                key={p.id}
                className="border border-slate-300 rounded overflow-hidden bg-slate-50"
              >
                <img
                  src={p.fileUrl}
                  alt={p.caption}
                  className="w-full h-36 object-cover bg-black"
                />
                <div className="p-1.5 text-[10px]">
                  <p className="font-bold text-slate-900">
                    {PHOTO_CATEGORY_LABELS[p.category]}
                  </p>
                  <p className="text-slate-500">
                    บันทึกเมื่อ: {formatThaiDate(p.takenAt)}{" "}
                    {formatThaiTime(p.takenAt)} น.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-1.5 border-t border-slate-300 flex justify-between text-[10px] text-slate-500">
        <span>
          AUTO1 - เอกสารแนบภาพถ่ายใบรับ-ส่งมอบรถยนต์นอกสถานที่ ({order.docNumber})
        </span>
        <span>หน้าที่ 2 จาก 2</span>
      </div>
    </div>
  );
}
