"use client";

import React from "react";
import { KeyRound, Edit3 } from "lucide-react";
import { UserAccountDTO } from "@/lib/repositories/userRepository";

interface UserManagementTableProps {
  loading: boolean;
  users: UserAccountDTO[];
  onQuickResetPassword: (user: UserAccountDTO) => void;
  onEditUser: (user: UserAccountDTO) => void;
}

export function UserManagementTable({
  loading,
  users,
  onQuickResetPassword,
  onEditUser,
}: UserManagementTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-900 text-white text-xs">
            <th className="py-3 px-4">Username</th>
            <th className="py-3 px-4">ชื่อ-นามสกุล (ตำแหน่ง)</th>
            <th className="py-3 px-4">สิทธิ์</th>
            <th className="py-3 px-4">สาขาที่สังกัด</th>
            <th className="py-3 px-4">รหัสผ่านเริ่มต้น</th>
            <th className="py-3 px-4 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-400">
                กำลังโหลดรายชื่อผู้ใช้งาน...
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                  {u.username}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-800">
                  {u.name}
                  {!u.isActive && (
                    <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                      ระงับ
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      u.role === "SYSADMIN"
                        ? "bg-red-100 text-red-800"
                        : u.role === "ADMIN"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">{u.branchName}</div>
                  <div className="text-[11px] text-slate-400">
                    รหัส: {u.branchCode} • โทร: {u.branchPhone}
                  </div>
                </td>
                <td className="py-2.5 px-4 font-mono text-xs">
                  {u.username === "sysadmin" ? (
                    <span className="text-red-700 font-bold">oil10041969*</span>
                  ) : (
                    <span className="text-blue-700 font-bold">1234</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onQuickResetPassword(u)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 inline-flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" /> รีเซ็ต
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditUser(u)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> แก้ไข
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
