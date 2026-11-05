"use client";

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import { FUEL_LEVEL_LABELS, FuelLevel } from "@/lib/types/handover";

interface CreateOrderModalProps {
  open: boolean;
  branches: BranchWithStaffDTO[];
  onClose: () => void;
  onCreated: (orderId: string) => void;
}

const FUEL_OPTIONS: FuelLevel[] = ["1/4", "1/2", "3/4", "FULL"];

export function CreateOrderModal({
  open,
  branches,
  onClose,
  onCreated,
}: CreateOrderModalProps) {
  const defaultBranch = branches[0];
  const [branchId, setBranchId] = useState(defaultBranch?.id ?? "");
  const [staffId, setStaffId] = useState(defaultBranch?.staff[0]?.id ?? "");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleBrandModel, setVehicleBrandModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [pickupMileage, setPickupMileage] = useState(15000);
  const [pickupFuelLevel, setPickupFuelLevel] = useState<FuelLevel>("1/2");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const activeBranch = branches.find((b) => b.id === branchId) ?? branches[0];
  const staffOptions = activeBranch?.staff ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: activeBranch?.id ?? branchId,
          staffId: staffId || staffOptions[0]?.id || "",
          customerName,
          customerPhone,
          vehicleBrandModel,
          licensePlate,
          vehicleColor,
          pickupMileage: Number(pickupMileage) || 0,
          pickupFuelLevel,
        }),
      });
      const json = (await res.json()) as { order?: { id: string }; error?: string };
      if (!res.ok || !json.order) throw new Error(json.error ?? "สร้างใบงานไม่สำเร็จ");
      onCreated(json.order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 className="font-bold text-slate-900 text-lg">
            เปิดใบรับ-ส่งมอบรถยนต์ใหม่ (Pick-up & Delivery)
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ศูนย์บริการสาขา *</label>
              <select
                value={activeBranch?.id ?? ""}
                onChange={(e) => {
                  const next = branches.find((b) => b.id === e.target.value);
                  setBranchId(e.target.value);
                  setStaffId(next?.staff[0]?.id ?? "");
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เจ้าหน้าที่ผู้ติดต่อ *</label>
              <select
                value={staffId || staffOptions[0]?.id || ""}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {staffOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ชื่อ-นามสกุล ลูกค้า *</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="เช่น คุณกิตติศักดิ์ วงศ์สวัสดิ์" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ลูกค้า *</label>
              <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="เช่น 081-234-5678" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ยี่ห้อ / รุ่นรถยนต์ *</label>
              <input type="text" required value={vehicleBrandModel} onChange={(e) => setVehicleBrandModel(e.target.value)} placeholder="เช่น Toyota Cross" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ทะเบียนรถ / จังหวัด *</label>
              <input type="text" required value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="เช่น 2ขค 8899 กทม." className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">สีรถ *</label>
              <input type="text" required value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="เช่น ขาวมุก" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เลขไมล์ก่อนรับรถ (กม.) *</label>
              <input type="number" min={0} required value={pickupMileage} onChange={(e) => setPickupMileage(Number(e.target.value) || 0)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ระดับน้ำมัน/แบตเตอรี่ *</label>
              <div className="grid grid-cols-4 gap-1.5">
                {FUEL_OPTIONS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPickupFuelLevel(lvl)}
                    className={`py-2 rounded-lg border text-xs font-bold ${
                      pickupFuelLevel === lvl ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {FUEL_LEVEL_LABELS[lvl]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              {submitting ? "กำลังสร้าง..." : "สร้างใบงานและไปหน้าตรวจสภาพรถ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
