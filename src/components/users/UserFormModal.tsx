"use client";

import React, { useState } from "react";
import { X, Save, RotateCcw } from "lucide-react";
import { UserAccountDTO } from "@/lib/repositories/userRepository";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";

interface UserFormModalProps {
  open: boolean;
  editingUser: UserAccountDTO | null;
  branches: BranchWithStaffDTO[];
  onClose: () => void;
  onSaved: () => void;
}

export function UserFormModal({
  open,
  editingUser,
  branches,
  onClose,
  onSaved,
}: UserFormModalProps) {
  const [username, setUsername] = useState(editingUser?.username ?? "");
  const [name, setName] = useState(editingUser?.name ?? "");
  const [role, setRole] = useState<"SYSADMIN" | "ADMIN" | "STAFF">(editingUser?.role ?? "STAFF");
  const [branchId, setBranchId] = useState(editingUser?.branchId ?? branches[0]?.id ?? "");
  const [password, setPassword] = useState(editingUser ? "" : "1234");
  const [isActive, setIsActive] = useState(editingUser?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PATCH" : "POST";
      const payload: Record<string, unknown> = {
        username,
        name,
        role,
        branchId: branchId || branches[0]?.id,
        isActive,
      };
      if (!editingUser || password.trim().length > 0) {
        payload.password = password.trim() || "1234";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "บันทึกข้อมูลไม่สำเร็จ");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            {editingUser ? `แก้ไขผู้ใช้งาน: ${editingUser.username}` : "เพิ่มผู้ใช้งานใหม่ประจำสาขา"}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Username (รหัสเข้าใช้งาน) *</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น bkk-rama3-04" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">ระดับสิทธิ์ (Role) *</label>
              <select value={role} onChange={(e) => setRole(e.target.value as "SYSADMIN" | "ADMIN" | "STAFF")} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="STAFF">STAFF (พนักงานรับ-ส่งรถ / ช่าง)</option>
                <option value="ADMIN">ADMIN (ผู้จัดการสาขา)</option>
                <option value="SYSADMIN">SYSADMIN (ผู้ดูแลระบบสูงสุด)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">ชื่อ-นามสกุล และตำแหน่ง *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมชาย ใจดี (เจ้าหน้าที่รับ-ส่งรถ)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">สาขา AUTO1 ที่สังกัด *</label>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 text-xs">
                {editingUser ? "ตั้งรหัสผ่านใหม่ (เว้นว่างหากไม่เปลี่ยน)" : "รหัสผ่าน (ค่าเริ่มต้น 1234) *"}
              </label>
              <button type="button" onClick={() => setPassword("1234")} className="text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> ตั้งเป็น 1234
              </button>
            </div>
            <input type="text" required={!editingUser} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={editingUser ? "พิมพ์รหัสผ่านใหม่ เช่น 1234..." : "1234"} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono" />
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-slate-300" />
            <span className="text-xs font-semibold text-slate-700">เปิดใช้งานบัญชีนี้ (Active)</span>
          </label>

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700">ยกเลิก</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold inline-flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลผู้ใช้"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
