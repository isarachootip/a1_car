"use client";

import React from "react";
import { formatThaiDate } from "@/lib/domain/docNumber";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import { OrderStatus } from "@/lib/types/handover";

interface HeaderSelectorProps {
  docNumber: string;
  createdAt: string;
  status: OrderStatus;
  branchId: string;
  staffId: string;
  branches: BranchWithStaffDTO[];
  disabled: boolean;
  onBranchChange: (branchId: string, defaultStaffId: string) => void;
  onStaffChange: (staffId: string) => void;
}

const STATUS_BADGE: Record<OrderStatus, { text: string; className: string }> = {
  DRAFT_PICKUP: {
    text: "กำลังดำเนินการขารับรถ (แก้ไขได้)",
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  PICKED_UP_LOCKED: {
    text: "รับรถแล้ว (ล็อกขารับ / รอส่งคืนรถ)",
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  COMPLETED: {
    text: "ส่งมอบรถคืนสำเร็จ (ล็อกเอกสารสมบูรณ์)",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
};

export function HeaderSelector({
  docNumber,
  createdAt,
  status,
  branchId,
  staffId,
  branches,
  disabled,
  onBranchChange,
  onStaffChange,
}: HeaderSelectorProps) {
  const currentBranch = branches.find((b) => b.id === branchId) ?? branches[0];
  const staffList = currentBranch?.staff ?? [];
  const badge = STATUS_BADGE[status];

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-start gap-4">
          <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-lg tracking-tight text-2xl flex items-center gap-1 shadow-sm">
            <span>AUTO</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">1</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              ศูนย์บริการรถยนต์ในเครือเซ็นทรัลรีเทล (AUTO1.CO.TH)
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              ใบรับ - ส่งมอบรถยนต์ (บริการนอกสถานที่ / Pick-up & Delivery)
            </h1>
            <span
              className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.className}`}
            >
              สถานะ: {badge.text}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm min-w-[230px]">
          <div className="flex justify-between gap-2">
            <span className="font-semibold text-slate-600">เลขที่เอกสาร:</span>
            <span className="font-mono font-bold text-slate-900">{docNumber}</span>
          </div>
          <div className="flex justify-between gap-2 mt-1">
            <span className="font-semibold text-slate-600">วันที่:</span>
            <span className="text-slate-900">{formatThaiDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-sm">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            ศูนย์บริการสาขา
          </label>
          <select
            value={branchId}
            disabled={disabled}
            onChange={(e) => {
              const nextBranch = branches.find((b) => b.id === e.target.value);
              onBranchChange(
                e.target.value,
                nextBranch?.staff[0]?.id ?? ""
              );
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white disabled:bg-slate-100"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            โทรศัพท์สาขา
          </label>
          <input
            type="text"
            readOnly
            value={currentBranch?.phone ?? "-"}
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            เจ้าหน้าที่ผู้ติดต่อ
          </label>
          <select
            value={staffId}
            disabled={disabled}
            onChange={(e) => onStaffChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white disabled:bg-slate-100"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
