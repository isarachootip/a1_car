"use client";

import React from "react";
import { Lock, Save } from "lucide-react";
import {
  FUEL_LEVEL_LABELS,
  FuelLevel,
  HandoverOrderDTO,
} from "@/lib/types/handover";
import { SignatureBox } from "./SignatureBox";

interface DeliveryStepCardProps {
  order: HandoverOrderDTO;
  deliveryEditable: boolean;
  deliveryMileage: number;
  deliveryFuelLevel: FuelLevel;
  onDeliveryFieldChange: (mileage: number, fuel: FuelLevel) => void;
  onSaveDeliveryInfo: () => Promise<void>;
  onSignCustomer: () => void;
  onSignStaff: () => void;
}

const FUEL_OPTIONS: FuelLevel[] = ["1/4", "1/2", "3/4", "FULL"];

export function DeliveryStepCard({
  order,
  deliveryEditable,
  deliveryMileage,
  deliveryFuelLevel,
  onDeliveryFieldChange,
  onSaveDeliveryInfo,
  onSignCustomer,
  onSignStaff,
}: DeliveryStepCardProps) {
  return (
    <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <h3 className="font-bold text-slate-900 text-sm">
            ขั้นตอนที่ 2: การส่งมอบรถคืนลูกค้า (Delivery)
          </h3>
          {order.status === "COMPLETED" && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> ส่งคืนสำเร็จ
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ไมล์หลังส่งคืน (กม.) *
            </label>
            <input
              type="number"
              min={order.pickupMileage}
              disabled={!deliveryEditable}
              value={deliveryMileage}
              onChange={(e) =>
                onDeliveryFieldChange(
                  Number(e.target.value) || 0,
                  deliveryFuelLevel
                )
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ระดับน้ำมันหลังส่งคืน *
            </label>
            <div className="grid grid-cols-4 gap-1">
              {FUEL_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={!deliveryEditable}
                  onClick={() => onDeliveryFieldChange(deliveryMileage, lvl)}
                  className={`py-1.5 rounded border font-bold ${
                    deliveryFuelLevel === lvl
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300"
                  } disabled:opacity-50`}
                >
                  {FUEL_LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {deliveryEditable && (
          <button
            type="button"
            onClick={onSaveDeliveryInfo}
            className="mb-3 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            บันทึกเลขไมล์และระดับน้ำมันขาส่งคืน
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SignatureBox
          label="ลงชื่อ (ลูกค้าผู้รับมอบคืน)"
          sigUrl={order.deliveryCustomerSig}
          signerName={order.deliveryCustomerSigner}
          signedAt={order.deliveryCustomerSignedAt}
          canSign={deliveryEditable}
          onClickSign={onSignCustomer}
        />
        <SignatureBox
          label="ลงชื่อ (พนักงานผู้ส่งมอบ)"
          sigUrl={order.deliveryStaffSig}
          signerName={order.deliveryStaffSigner}
          signedAt={order.deliveryStaffSignedAt}
          canSign={deliveryEditable}
          onClickSign={onSignStaff}
        />
      </div>
    </div>
  );
}
