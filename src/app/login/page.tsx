"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, Building2, UserCheck, ArrowLeft } from "lucide-react";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState<BranchWithStaffDTO[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/branches")
      .then((r) => r.json())
      .then((json: { branches?: BranchWithStaffDTO[] }) => {
        const list = json.branches ?? [];
        setBranches(list);
        if (list[0]) setSelectedBranchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) ?? branches[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-slate-900 font-black px-3 py-1.5 rounded-xl text-lg flex items-center gap-1">
              <span>AUTO</span>
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">1</span>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base">
                เข้าสู่ระบบพนักงาน / ผู้ดูแลระบบ
              </h1>
              <p className="text-xs text-slate-500">
                ระบบใบรับ - ส่งมอบรถยนต์ออนไลน์ AUTO1
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> หน้าหลัก
          </Link>
        </div>

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อผู้ใช้งาน (Username หรือ ชื่อพนักงาน) *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="เช่น sysadmin หรือ bkk-rama3-01 หรือ สมชาย ใจดี"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รหัสผ่าน (Password) *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-extrabold text-slate-700">
            ⚡ เลือกบัญชีด่วน (สำหรับสาธิต / พนักงานสาขา):
          </p>

          <button
            type="button"
            onClick={() => {
              setIdentifier("sysadmin");
              setPassword("oil10041969*");
            }}
            className="w-full text-left px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs flex items-center justify-between"
          >
            <span className="font-bold text-slate-900 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              SysAdmin: <code className="bg-white px-1.5 py-0.5 rounded">sysadmin</code>
            </span>
            <span className="text-[11px] font-semibold text-amber-800">
              กดเพื่อเติมรหัสผ่านอัตโนมัติ
            </span>
          </button>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              เลือกสาขาเพื่อดูรายชื่อพนักงาน (รหัสผ่านเริ่มต้น = 1234):
            </label>
            <select
              value={selectedBranch?.id ?? ""}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>

            <div className="space-y-1 pt-1">
              {(selectedBranch?.staff ?? []).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setIdentifier(s.username || s.name);
                    setPassword("1234");
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 truncate inline-flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {s.name}
                  </span>
                  <code className="text-[11px] text-blue-700 font-bold shrink-0 ml-2">
                    {s.username} (1234)
                  </code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
