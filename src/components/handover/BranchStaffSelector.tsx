"use client";

import React, { useMemo, useState } from "react";
import { Search, Phone, Users } from "lucide-react";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";

interface BranchStaffSelectorProps {
  branches: BranchWithStaffDTO[];
  activeBranch: BranchWithStaffDTO | undefined;
  staffId: string;
  onSelectBranch: (branch: BranchWithStaffDTO) => void;
  onSelectStaff: (staffId: string) => void;
}

export function BranchStaffSelector({
  branches,
  activeBranch,
  staffId,
  onSelectBranch,
  onSelectStaff,
}: BranchStaffSelectorProps) {
  const [branchSearch, setBranchSearch] = useState("");

  const filteredBranches = useMemo(() => {
    const q = branchSearch.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.phone.includes(q)
    );
  }, [branches, branchSearch]);

  const groupedByRegion = useMemo(() => {
    const groups = new Map<string, BranchWithStaffDTO[]>();
    for (const b of filteredBranches) {
      const reg = b.region || "สาขาทั่วไป";
      const list = groups.get(reg) ?? [];
      list.push(b);
      groups.set(reg, list);
    }
    return Array.from(groups.entries());
  }, [filteredBranches]);

  const staffOptions = activeBranch?.staff ?? [];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-800">
          🏢 เลือกศูนย์บริการสาขา AUTO1 ({branches.length} สาขาทั่วประเทศ) *
        </span>
        {activeBranch && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Phone className="w-3 h-3" />
            โทรสาขา: {activeBranch.phone}
          </span>
        )}
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={branchSearch}
          onChange={(e) => {
            const val = e.target.value;
            setBranchSearch(val);
            const q = val.trim().toLowerCase();
            if (q) {
              const firstMatch = branches.find(
                (b) =>
                  b.name.toLowerCase().includes(q) ||
                  b.code.toLowerCase().includes(q) ||
                  b.region.toLowerCase().includes(q)
              );
              if (firstMatch && firstMatch.id !== activeBranch?.id) {
                onSelectBranch(firstMatch);
              }
            }
          }}
          placeholder="พิมพ์ค้นหาสาขา เช่น ชิดลม, บางนา, รัตนาธิเบศร์, ชลบุรี, เชียงใหม่, ขอนแก่น, ภูเก็ต..."
          className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block font-semibold text-slate-700 mb-1 text-xs">
            สาขาที่ให้บริการ ({filteredBranches.length} สาขา) *
          </label>
          <select
            value={activeBranch?.id ?? ""}
            onChange={(e) => {
              const next = branches.find((b) => b.id === e.target.value);
              if (next) onSelectBranch(next);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium"
          >
            {groupedByRegion.map(([region, items]) => (
              <optgroup key={region} label={`📍 ${region} (${items.length} สาขา)`}>
                {items.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.phone})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1 text-xs flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            พนักงานผู้รับผิดชอบประจำสาขา ({staffOptions.length} คน) *
          </label>
          <select
            value={staffId || staffOptions[0]?.id || ""}
            onChange={(e) => onSelectStaff(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium"
          >
            {staffOptions.map((s) => (
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
