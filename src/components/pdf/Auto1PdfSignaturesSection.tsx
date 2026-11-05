"use client";

import React from "react";
import { formatThaiDate, formatThaiTime } from "@/lib/domain/docNumber";
import { FuelLevel, HandoverOrderDTO } from "@/lib/types/handover";

const DELIVERY_FUELS: Array<{ key: FuelLevel; label: string }> = [
  { key: "1/4", label: "1/4" },
  { key: "1/2", label: "1/2" },
  { key: "3/4", label: "3/4" },
  { key: "FULL", label: "เต็ม" },
];

export function Auto1PdfSignaturesSection({
  order,
}: {
  order: HandoverOrderDTO;
}) {
  return (
    <div className="mt-2.5">
      <div className="bg-slate-100 border-l-4 border-slate-900 px-2.5 py-1 font-bold text-[12px] text-slate-900 mb-1.5">
        5. การลงนามยืนยันและรับมอบรถ (CONFIRMATION & HANDOVER SIGNATURES)
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Pickup Box */}
        <div className="border border-slate-300 rounded p-2 flex flex-col justify-between">
          <p className="font-bold text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-2">
            ขั้นตอนที่ 1: การรับรถจากลูกค้า (Pick-up)
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <PdfSigCell
              title="ลงชื่อ (ลูกค้าผู้ส่งมอบ)"
              sig={order.pickupCustomerSig}
              signer={order.pickupCustomerSignerName}
              signedAt={order.pickupCustomerSignedAt}
            />
            <PdfSigCell
              title="ลงชื่อ (พนักงานผู้รับรถ)"
              sig={order.pickupStaffSig}
              signer={order.pickupStaffSignerName}
              signedAt={order.pickupStaffSignedAt}
            />
          </div>
        </div>

        {/* Delivery Box */}
        <div className="border border-slate-300 rounded p-2 flex flex-col justify-between">
          <div>
            <p className="font-bold text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-1">
              ขั้นตอนที่ 2: การส่งมอบรถคืนลูกค้า (Delivery)
            </p>
            <div className="text-[10.5px] text-slate-800 mb-1 flex flex-wrap items-center gap-1">
              <span>
                ไมล์หลังส่งคืน:{" "}
                <b className="underline px-1">
                  {order.deliveryMileage !== null
                    ? order.deliveryMileage.toLocaleString()
                    : "..........."}
                </b>{" "}
                กม. | น้ำมัน:
              </span>
              {DELIVERY_FUELS.map((f) => (
                <span key={f.key} className="mr-1">
                  [{order.deliveryFuelLevel === f.key ? "✓" : " "}] {f.label}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PdfSigCell
              title="ลงชื่อ (ลูกค้าผู้รับมอบคืน)"
              sig={order.deliveryCustomerSig}
              signer={order.deliveryCustomerSigner}
              signedAt={order.deliveryCustomerSignedAt}
            />
            <PdfSigCell
              title="ลงชื่อ (พนักงานผู้ส่งมอบ)"
              sig={order.deliveryStaffSig}
              signer={order.deliveryStaffSigner}
              signedAt={order.deliveryStaffSignedAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfSigCell({
  title,
  sig,
  signer,
  signedAt,
}: {
  title: string;
  sig: string | null;
  signer: string | null;
  signedAt: string | null;
}) {
  return (
    <div className="text-center text-[10px] text-slate-800">
      <div className="h-12 border-b border-dotted border-slate-400 flex items-center justify-center mb-0.5">
        {sig && (
          <img src={sig} alt={title} className="max-h-11 object-contain" />
        )}
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-[9.5px] truncate">
        ({signer || "........................................"})
      </p>
      <p className="text-[9px] text-slate-600">
        วันที่ {formatThaiDate(signedAt)} เวลา {formatThaiTime(signedAt)} น.
      </p>
    </div>
  );
}
