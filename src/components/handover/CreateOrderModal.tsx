"use client";

import React, { useState } from "react";
import { X, PlusCircle, MapPin, Building2 } from "lucide-react";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import { FUEL_LEVEL_LABELS, FuelLevel, ServiceLocationType } from "@/lib/types/handover";
import { LocationMapPicker } from "./LocationMapPicker";
import { BranchStaffSelector } from "./BranchStaffSelector";

interface CreateOrderModalProps {
  open: boolean;
  branches: BranchWithStaffDTO[];
  onClose: () => void;
  onCreated: (orderId: string) => void;
}

const FUEL_OPTIONS: FuelLevel[] = ["1/4", "1/2", "3/4", "FULL"];

export function CreateOrderModal({ open, branches, onClose, onCreated }: CreateOrderModalProps) {
  const defaultBranch = branches[0];
  const [serviceLocationType, setServiceLocationType] = useState<ServiceLocationType>("ON_SITE");
  const [branchId, setBranchId] = useState(defaultBranch?.id ?? "");
  const [staffId, setStaffId] = useState(defaultBranch?.staff[0]?.id ?? "");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupMapUrl, setPickupMapUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleBrandModel, setVehicleBrandModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [pickupMileage, setPickupMileage] = useState(0);
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
          serviceLocationType, pickupLocation, pickupMapUrl, scheduledAt,
          customerName, customerPhone, vehicleBrandModel, licensePlate, vehicleColor,
          pickupMileage: Number(pickupMileage) || 0, pickupFuelLevel,
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-xl border border-slate-200 my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 className="font-bold text-slate-900 text-base sm:text-lg">
            เปิดใบรับ-ส่งมอบรถยนต์ใหม่ (สาขา / Site ลูกค้า)
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setServiceLocationType("ON_SITE")} className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${serviceLocationType === "ON_SITE" ? "bg-slate-900 text-amber-400 border-slate-900" : "bg-slate-50 text-slate-700 border-slate-300"}`}>
              <MapPin className="w-4 h-4" /> ไปรับรถที่ Site ลูกค้า
            </button>
            <button type="button" onClick={() => setServiceLocationType("AT_BRANCH")} className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${serviceLocationType === "AT_BRANCH" ? "bg-slate-900 text-amber-400 border-slate-900" : "bg-slate-50 text-slate-700 border-slate-300"}`}>
              <Building2 className="w-4 h-4" /> รับรถที่สาขา
            </button>
          </div>

          <BranchStaffSelector
            branches={branches}
            activeBranch={activeBranch}
            staffId={staffId}
            onSelectBranch={(next) => {
              setBranchId(next.id);
              setStaffId(next.staff[0]?.id ?? "");
            }}
            onSelectStaff={setStaffId}
          />

          {serviceLocationType === "ON_SITE" && (
            <LocationMapPicker
              branchCode={activeBranch?.code}
              pickupLocation={pickupLocation}
              pickupMapUrl={pickupMapUrl}
              scheduledAt={scheduledAt}
              onChangeLocation={setPickupLocation}
              onChangeMapUrl={setPickupMapUrl}
              onChangeScheduledAt={setScheduledAt}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">ชื่อ-นามสกุล ลูกค้า *</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="เช่น คุณกิตติศักดิ์ วงศ์สวัสดิ์" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">เบอร์โทรศัพท์ลูกค้า *</label>
              <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="เช่น 081-234-5678" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">ยี่ห้อ / รุ่นรถยนต์ *</label>
              <input type="text" required value={vehicleBrandModel} onChange={(e) => setVehicleBrandModel(e.target.value)} placeholder="เช่น Toyota Cross" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">ทะเบียนรถ / จังหวัด *</label>
              <input type="text" required value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="เช่น 2ขค 8899 กทม." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">สีรถ *</label>
              <input type="text" required value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="เช่น ขาวมุก" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">เลขไมล์ก่อนรับรถ (ใส่ 0 ได้ถ้ารับแจ้งล่วงหน้า)</label>
              <input type="number" min={0} value={pickupMileage} onChange={(e) => setPickupMileage(Number(e.target.value) || 0)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">ระดับน้ำมันเบื้องต้น</label>
              <div className="grid grid-cols-4 gap-1.5">
                {FUEL_OPTIONS.map((lvl) => (
                  <button key={lvl} type="button" onClick={() => setPickupFuelLevel(lvl)} className={`py-2 rounded-lg border text-xs font-bold ${pickupFuelLevel === lvl ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}>
                    {FUEL_LEVEL_LABELS[lvl]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700">ยกเลิก</button>
            <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold inline-flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              {submitting ? "กำลังสร้าง..." : "บันทึกและเปิดใบงาน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
