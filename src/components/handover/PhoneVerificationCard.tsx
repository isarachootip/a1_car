"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { OrderStatus } from "@/lib/types/handover";

export interface PublicOrderSummary {
  docNumber: string;
  branchName: string;
  customerName: string;
  licensePlate: string;
  vehicleBrandModel: string;
  status: OrderStatus;
  maskedPhone: string;
}

interface PhoneVerificationCardProps {
  summary: PublicOrderSummary;
  phoneLast4: string;
  verifying: boolean;
  error: string;
  onPhoneChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PhoneVerificationCard({
  summary,
  phoneLast4,
  verifying,
  error,
  onPhoneChange,
  onSubmit,
}: PhoneVerificationCardProps) {
  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-400 text-slate-900 font-black px-3 py-1.5 rounded-lg text-lg">
            AUTO 1
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base">
              ระบบยืนยันและลงนามรับ-ส่งมอบรถยนต์ออนไลน์
            </h1>
            <p className="text-xs text-slate-500">
              เลขที่เอกสาร: {summary.docNumber}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 mb-4">
          <p>
            <b>ศูนย์บริการ:</b> {summary.branchName}
          </p>
          <p>
            <b>ชื่อลูกค้า:</b> {summary.customerName}
          </p>
          <p>
            <b>รถยนต์:</b> {summary.vehicleBrandModel} ({summary.licensePlate})
          </p>
          <p>
            <b>เบอร์โทรศัพท์ที่ลงทะเบียน:</b> {summary.maskedPhone}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              กรุณากรอกเลขท้ายเบอร์โทรศัพท์ 4 หลักเพื่อเปิดดูเอกสารและเซ็นชื่อ *
            </label>
            <input
              type="tel"
              maxLength={4}
              required
              value={phoneLast4}
              onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
              placeholder="เช่น 5678"
              className="w-full text-center tracking-widest font-mono text-xl font-bold rounded-xl border border-slate-300 px-3 py-2.5"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={verifying || phoneLast4.length !== 4}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            {verifying ? "กำลังตรวจสอบ..." : "ยืนยันตัวตนและเปิดดูเอกสาร"}
          </button>
        </form>
      </div>
    </main>
  );
}
