"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Printer } from "lucide-react";
import { GuideSectionsPart1 } from "@/components/guide/GuideSectionsPart1";
import { GuideSectionsPart2 } from "@/components/guide/GuideSectionsPart2";

export default function UserGuidePage() {
  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-4 py-5 pb-12">
      {/* Top Bar */}
      <div className="no-print bg-slate-900 text-white rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold">
                คู่มือการใช้งานระบบใบรับ - ส่งมอบรถยนต์ AUTO1
              </h1>
              <p className="text-[11px] text-slate-300">
                สำหรับพนักงานรับแจ้งคิวที่สาขา และพนักงานรับ-ส่งรถนอกสถานที่ (Site ลูกค้า)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold inline-flex items-center gap-1.5 shadow"
        >
          <Printer className="w-4 h-4" /> พิมพ์คู่มือ / บันทึกเป็น PDF
        </button>
      </div>

      {/* Print Header */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            คู่มือประกอบหน้าจอ: ระบบใบรับ - ส่งมอบรถยนต์นอกสถานที่ AUTO1
          </h1>
          <p className="text-xs text-slate-600">
            รองรับการทำงานที่สาขา (Branch) และการออกไปรับ-ส่งรถที่ Site ลูกค้าผ่านสมาร์ทโฟน
          </p>
        </div>
        <div className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded text-lg">
          AUTO 1
        </div>
      </div>

      <GuideSectionsPart1 />
      <div className="mt-6">
        <GuideSectionsPart2 />
      </div>
    </main>
  );
}
