"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, FileText, Printer, QrCode } from "lucide-react";

interface OrderDetailToolbarProps {
  docNumber: string;
  viewMode: "FORM" | "PDF";
  onChangeViewMode: (mode: "FORM" | "PDF") => void;
  onOpenQr: () => void;
  onPrintPdf: () => void;
}

export function OrderDetailToolbar({
  docNumber,
  viewMode,
  onChangeViewMode,
  onOpenQr,
  onPrintPdf,
}: OrderDetailToolbarProps) {
  return (
    <div className="no-print bg-slate-900 text-white rounded-xl p-3.5 mb-5 flex flex-wrap items-center justify-between gap-3 shadow">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้ารายการ
        </Link>
        <span className="font-mono font-bold text-sm text-amber-400">
          {docNumber}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeViewMode("FORM")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${
            viewMode === "FORM"
              ? "bg-amber-400 text-slate-900"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> โหมดกรอกข้อมูล/ถ่ายรูป/เซ็นชื่อ
        </button>
        <button
          type="button"
          onClick={() => onChangeViewMode("PDF")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${
            viewMode === "PDF"
              ? "bg-amber-400 text-slate-900"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> ดูเอกสาร PDF ต้นฉบับ
        </button>
        <button
          type="button"
          onClick={onOpenQr}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          <QrCode className="w-3.5 h-3.5" /> QR ส่งลูกค้าเซ็น
        </button>
        <button
          type="button"
          onClick={onPrintPdf}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" /> พิมพ์ / บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
}
