"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Plus, Users, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { SessionUserPayload } from "@/lib/domain/authPassword";

interface DashboardTopBarProps {
  currentUser: SessionUserPayload | null;
  onOpenCreate: () => void;
  onLogout: () => void;
}

export function DashboardTopBar({
  currentUser,
  onOpenCreate,
  onLogout,
}: DashboardTopBarProps) {
  return (
    <header className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-400 text-slate-900 font-black px-4 py-2.5 rounded-xl text-2xl flex items-center gap-1">
            <span>AUTO</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">1</span>
          </div>
          <div>
            <p className="text-xs text-amber-300 font-semibold">
              ศูนย์บริการรถยนต์ในเครือเซ็นทรัลรีเทล (Pick-up & Delivery Online System)
            </p>
            <h1 className="text-xl md:text-2xl font-extrabold">
              ระบบจัดการใบรับ - ส่งมอบรถยนต์นอกสถานที่
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/users"
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-3.5 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm transition"
          >
            <Users className="w-4 h-4 text-amber-400" />
            จัดการผู้ใช้ (Users)
          </Link>
          <Link
            href="/guide"
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold px-3.5 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm transition"
          >
            <BookOpen className="w-4 h-4" />
            คู่มือการใช้งาน
          </Link>
          <button
            type="button"
            onClick={onOpenCreate}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm shadow transition"
          >
            <Plus className="w-5 h-5" />
            สร้างใบรับ-ส่งมอบรถใหม่
          </button>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        {currentUser ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              ผู้ใช้งาน: {currentUser.name} ({currentUser.username})
            </span>
            <span className="text-slate-400">
              สังกัด: <strong className="text-slate-200">{currentUser.branchName}</strong> • สิทธิ์:{" "}
              <strong className="text-amber-300">{currentUser.role}</strong>
            </span>
          </div>
        ) : (
          <span className="text-slate-400">
            ยังไม่ได้ระบุตัวตนพนักงาน (สามารถกดปุ่ม <strong>เข้าสู่ระบบ</strong> เพื่อล็อกอินด้วย{" "}
            <code className="text-amber-300">sysadmin</code> หรือรหัสพนักงานสาขา)
          </span>
        )}

        <div>
          {currentUser ? (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 border border-slate-700 font-bold inline-flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" /> เข้าสู่ระบบ (Login)
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
