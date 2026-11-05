"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Plus, Search, CheckCircle2, Clock } from "lucide-react";
import { CreateOrderModal } from "@/components/handover/CreateOrderModal";
import { OrderListGrid } from "@/components/handover/OrderListGrid";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import { HandoverOrderDTO } from "@/lib/types/handover";

export default function HomeDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<HandoverOrderDTO[]>([]);
  const [branches, setBranches] = useState<BranchWithStaffDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/orders"), fetch("/api/branches")])
      .then(async ([ordersRes, branchesRes]) => {
        const ordersJson = (await ordersRes.json()) as {
          orders?: HandoverOrderDTO[];
        };
        const branchesJson = (await branchesRes.json()) as {
          branches?: BranchWithStaffDTO[];
        };
        setOrders(ordersJson.orders ?? []);
        setBranches(branchesJson.branches ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchQuery =
      !q ||
      o.docNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.licensePlate.toLowerCase().includes(q) ||
      o.vehicleBrandModel.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="bg-slate-900 text-white rounded-2xl p-6 shadow-md mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 text-sm shadow transition"
        >
          <Plus className="w-5 h-5" />
          สร้างใบรับ-ส่งมอบรถใหม่
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">รอรับรถ (Pick-up)</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {orders.filter((o) => o.status === "DRAFT_PICKUP").length} ใบงาน
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">รับรถแล้ว / รอส่งคืน</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {orders.filter((o) => o.status === "PICKED_UP_LOCKED").length} ใบงาน
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">ส่งมอบคืนสำเร็จ</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {orders.filter((o) => o.status === "COMPLETED").length} ใบงาน
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาเลขเอกสาร, ชื่อลูกค้า, ทะเบียนรถ, รุ่นรถ..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "ทั้งหมด" },
            { id: "DRAFT_PICKUP", label: "รอรับรถ" },
            { id: "PICKED_UP_LOCKED", label: "รอส่งคืน" },
            { id: "COMPLETED", label: "สำเร็จ" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <OrderListGrid loading={loading} orders={filtered} />

      <CreateOrderModal
        open={createOpen}
        branches={branches}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => {
          setCreateOpen(false);
          router.push(`/orders/${id}`);
        }}
      />
    </main>
  );
}
