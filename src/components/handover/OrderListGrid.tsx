"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import { formatThaiDate } from "@/lib/domain/docNumber";
import { HandoverOrderDTO, OrderStatus } from "@/lib/types/handover";

const STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  DRAFT_PICKUP: {
    label: "รอรับรถ / รอลูกค้าเซ็นขารับ",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
  },
  PICKED_UP_LOCKED: {
    label: "รับรถแล้ว (รอส่งคืนลูกค้า)",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
  },
  COMPLETED: {
    label: "ส่งมอบรถคืนเรียบร้อย",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
};

export function OrderListGrid({
  loading,
  orders,
}: {
  loading: boolean;
  orders: HandoverOrderDTO[];
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center text-sm text-slate-500 border border-slate-200">
        กำลังโหลดรายการใบรับ-ส่งมอบรถยนต์...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="font-bold text-slate-700">
          ยังไม่มีรายการใบรับ-ส่งมอบรถยนต์
        </p>
        <p className="text-xs text-slate-500 mt-1">
          กดปุ่ม &ldquo;สร้างใบรับ-ส่งมอบรถใหม่&rdquo; ด้านบนเพื่อเริ่มต้นบันทึกข้อมูลและถ่ายรูปรถลูกค้า
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => {
        const meta = STATUS_META[order.status];
        return (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono font-extrabold text-base text-slate-900">
                  {order.docNumber}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}
                >
                  {meta.label}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                🚗 {order.vehicleBrandModel} — ทะเบียน {order.licensePlate} (สี
                {order.vehicleColor})
              </p>
              <p className="text-xs text-slate-600 mt-1">
                👤 ลูกค้า: <b>{order.customerName}</b> ({order.customerPhone})
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                🏢 {order.branch.name} | เจ้าหน้าที่: {order.staff.name}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>วันที่เปิดเอกสาร: {formatThaiDate(order.createdAt)}</span>
              <span className="font-bold text-slate-900 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                รูปถ่าย {order.photos.length} รูป / แผล {order.damageMarks.length}{" "}
                จุด →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
