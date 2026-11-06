"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, ArrowLeft, ShieldCheck, LogIn } from "lucide-react";
import { UserAccountDTO } from "@/lib/repositories/userRepository";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserManagementTable } from "@/components/users/UserManagementTable";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAccountDTO[]>([]);
  const [branches, setBranches] = useState<BranchWithStaffDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccountDTO | null>(null);
  const [toast, setToast] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([fetch("/api/users"), fetch("/api/branches")])
      .then(async ([uRes, bRes]) => {
        const uJson = (await uRes.json()) as { users?: UserAccountDTO[] };
        const bJson = (await bRes.json()) as { branches?: BranchWithStaffDTO[] };
        setUsers(uJson.users ?? []);
        setBranches(bJson.branches ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchBranch = branchFilter === "ALL" || u.branchId === branchFilter;
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchQuery =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.branchName.toLowerCase().includes(q) ||
        u.branchCode.toLowerCase().includes(q);
      return matchBranch && matchRole && matchQuery;
    });
  }, [users, search, branchFilter, roleFilter]);

  const handleQuickResetPassword = async (u: UserAccountDTO) => {
    const targetPass = u.username === "sysadmin" ? "oil10041969*" : "1234";
    await fetch(`/api/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: targetPass }),
    });
    setToast(`รีเซ็ตรหัสผ่านของ "${u.username}" เป็น "${targetPass}" เรียบร้อยแล้ว`);
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <header className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-900 p-2.5 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-amber-300 font-semibold">
              AUTO1 User & Branch Staff Management
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold">
              ระบบจัดการผู้ใช้งานและรหัสผ่านประจำสาขา ({users.length} บัญชี)
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> หน้าใบงาน
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" /> ทดสอบ Login
          </Link>
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> เพิ่มผู้ใช้งานใหม่
          </button>
        </div>
      </header>

      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>ผู้ดูแลระบบสูงสุด (SysAdmin):</strong> Username ={" "}
            <code className="bg-white px-1.5 py-0.5 rounded font-bold text-slate-900">sysadmin</code>{" "}
            | Password ={" "}
            <code className="bg-white px-1.5 py-0.5 rounded font-bold text-red-700">oil10041969*</code>
          </span>
        </div>
        <span>
          <strong>พนักงานประจำสาขาทั้ง {branches.length} สาขา:</strong> เข้าด้วย{" "}
          <code className="bg-white px-1.5 py-0.5 rounded font-bold">Username</code> หรือ{" "}
          <code className="bg-white px-1.5 py-0.5 rounded font-bold">ชื่อพนักงาน</code> | Password เริ่มต้น ={" "}
          <code className="bg-white px-1.5 py-0.5 rounded font-bold text-blue-700">1234</code>
        </span>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold">
          ✅ {toast}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา Username, ชื่อพนักงาน, ชื่อสาขา..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm"
          />
        </div>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm"
        >
          <option value="ALL">🏢 ทุกสาขาทั่วประเทศ ({branches.length} สาขา)</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.code})
            </option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm"
        >
          <option value="ALL">👤 ทุกระดับสิทธิ์ ({users.length} คน)</option>
          <option value="SYSADMIN">SYSADMIN (ผู้ดูแลระบบสูงสุด)</option>
          <option value="ADMIN">ADMIN (ผู้จัดการสาขา)</option>
          <option value="STAFF">STAFF (พนักงานรับ-ส่งรถ / ช่าง)</option>
        </select>
      </div>

      <UserManagementTable
        loading={loading}
        users={filteredUsers}
        onQuickResetPassword={handleQuickResetPassword}
        onEditUser={(u) => {
          setEditingUser(u);
          setModalOpen(true);
        }}
      />

      {modalOpen && (
        <UserFormModal
          open={modalOpen}
          editingUser={editingUser}
          branches={branches}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadData();
          }}
        />
      )}
    </main>
  );
}
