"use client";

import React from "react";
import { FUEL_LEVEL_LABELS, FuelLevel } from "@/lib/types/handover";
import { ServiceRequestedSection } from "./ServiceRequestedSection";

export interface CustomerVehicleFields {
  customerName: string;
  customerPhone: string;
  vehicleBrandModel: string;
  licensePlate: string;
  vehicleColor: string;
  pickupMileage: number;
  pickupFuelLevel: FuelLevel;
  serviceStandard: boolean;
  serviceOilFluid: boolean;
  serviceTireAlignment: boolean;
  serviceBrakeSuspension: boolean;
  serviceAdditionalNote: string;
}

interface CustomerVehicleSectionProps {
  values: CustomerVehicleFields;
  disabled: boolean;
  onChange: <K extends keyof CustomerVehicleFields>(
    key: K,
    val: CustomerVehicleFields[K]
  ) => void;
}

const FUEL_OPTIONS: FuelLevel[] = ["1/4", "1/2", "3/4", "FULL"];

export function CustomerVehicleSection({
  values,
  disabled,
  onChange,
}: CustomerVehicleSectionProps) {
  return (
    <div className="space-y-5">
      <section className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 border-l-4 border-slate-900 pl-3 py-1 bg-slate-100 rounded-r mb-4">
          1. ข้อมูลลูกค้าและข้อมูลรถยนต์ (CUSTOMER & VEHICLE INFORMATION)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อ-นามสกุล ลูกค้า *
            </label>
            <input
              type="text"
              disabled={disabled}
              value={values.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
              placeholder="เช่น คุณสมศักดิ์ รักรถ"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              เบอร์โทรศัพท์ติดต่อ * (ใช้ 4 ตัวท้ายยืนยันตอนลูกค้ากดลิงก์เซ็น)
            </label>
            <input
              type="tel"
              disabled={disabled}
              value={values.customerPhone}
              onChange={(e) => onChange("customerPhone", e.target.value)}
              placeholder="เช่น 081-234-5678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ยี่ห้อ / รุ่นรถยนต์ *
            </label>
            <input
              type="text"
              disabled={disabled}
              value={values.vehicleBrandModel}
              onChange={(e) => onChange("vehicleBrandModel", e.target.value)}
              placeholder="เช่น Honda Civic FE"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ทะเบียนรถ / จังหวัด *
            </label>
            <input
              type="text"
              disabled={disabled}
              value={values.licensePlate}
              onChange={(e) => onChange("licensePlate", e.target.value)}
              placeholder="เช่น 1กข 1234 กทม."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              สีรถ *
            </label>
            <input
              type="text"
              disabled={disabled}
              value={values.vehicleColor}
              onChange={(e) => onChange("vehicleColor", e.target.value)}
              placeholder="เช่น ขาว, ดำ, เทา"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              เลขไมล์ก่อนรับรถ (กม.) *
            </label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={values.pickupMileage}
              onChange={(e) =>
                onChange("pickupMileage", Number(e.target.value) || 0)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ระดับน้ำมัน/แบตเตอรี่ก่อนรับรถ *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {FUEL_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange("pickupFuelLevel", lvl)}
                  className={`py-2 px-3 rounded-lg border text-sm font-semibold transition ${
                    values.pickupFuelLevel === lvl
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  } disabled:opacity-60`}
                >
                  {FUEL_LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceRequestedSection
        values={values}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
