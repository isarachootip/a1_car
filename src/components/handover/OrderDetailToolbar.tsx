"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Printer,
  QrCode,
  Smartphone,
  Monitor,
} from "lucide-react";

export type LayoutMode = "WIZARD" | "FULL" | "PDF";

interface OrderDetailToolbarProps {
  docNumber: string;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  onOpenQr: () => void;
  onPrintPdf: () => void;
}

export function OrderDetailToolbar({
  docNumber,
  layoutMode,
  onChangeLayoutMode,
  onOpenQr,
  onPrintPdf,
}: OrderDetailToolbarProps) {
  return (
    <div className="no-print bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 mb-4 flex flex-wrap items-center justify-between gap-2.5 shadow">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> รายการใบงาน
        </Link>
        <span className="font-mono font-bold text-xs sm:text-sm text-amber-400">
          {docNumber}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onChangeLayoutMode("WIZARD")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
            layoutMode === "WIZARD"
              ? "bg-amber-400 text-slate-900"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> โหมดมือถือ (ทีละขั้น)
        </button>

        <button
          type="button"
          onClick={() => onChangeLayoutMode("FULL")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
            layoutMode === "FULL"
              ? "bg-amber-400 text-slate-900"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" /> โหมดสาขา (หน้าเดียว)
        </button>

        <button
          type="button"
          onClick={() => onChangeLayoutMode("PDF")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
            layoutMode === "PDF"
              ? "bg-amber-400 text-slate-900"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> ดู PDF
        </button>

        <button
          type="button"
          onClick={onOpenQr}
          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1"
        >
          <QrCode className="w-3.5 h-3.5" /> แชร์/QR
        </button>

        <button
          type="button"
          onClick={onPrintPdf}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1"
        >
          <Printer className="w-3.5 h-3.5" /> พิมพ์ PDF
        </button>
      </div>
    </div>
  );
}
