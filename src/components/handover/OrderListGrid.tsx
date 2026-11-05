"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  MapPin,
  Building2,
  PhoneCall,
  Navigation,
} from "lucide-react";
import { formatThaiDate } from "@/lib/domain/docNumber";
import {
  buildGoogleMapsSearchUrl,
  formatTelHref,
} from "@/lib/domain/handoverRules";
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
          กดปุ่ม &ldquo;สร้างใบรับ-ส่งมอบรถใหม่&rdquo; ด้านบนเพื่อรับแจ้งคิวที่สาขาหรือเริ่มรับรถที่หน้างาน
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => {
        const meta = STATUS_META[order.status];
        const mapUrl = buildGoogleMapsSearchUrl(
          order.pickupLocation,
          order.pickupMapUrl
        );
        return (
          <div
            key={order.id}
            className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-4 sm:p-5 shadow-sm transition flex flex-col justify-between"
          >
            <Link href={`/orders/${order.id}`} className="block">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-slate-900">
                    {order.docNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                      order.serviceLocationType === "ON_SITE"
                        ? "bg-slate-900 text-amber-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.serviceLocationType === "ON_SITE" ? (
                      <>
                        <MapPin className="w-3 h-3" /> รับที่ Site ลูกค้า
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3 h-3" /> รับที่สาขา
                      </>
                    )}
                  </span>
                </div>
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
              {order.pickupLocation && (
                <p className="text-xs text-blue-700 font-semibold mt-1">
                  📍 นัดรับ: {order.pickupLocation}{" "}
                  {order.scheduledAt && `(${order.scheduledAt})`}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-0.5">
                🏢 {order.branch.name} | เจ้าหน้าที่: {order.staff.name}
              </p>
            </Link>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={formatTelHref(order.customerPhone)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold inline-flex items-center gap-1 border border-emerald-200"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> โทร
                </a>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold inline-flex items-center gap-1 border border-blue-200"
                  >
                    <Navigation className="w-3.5 h-3.5" /> แผนที่
                  </a>
                )}
              </div>

              <Link
                href={`/orders/${order.id}`}
                className="font-bold text-slate-900 inline-flex items-center gap-1 py-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                รูป {order.photos.length}/5 • แผล {order.damageMarks.length} จุด (
                {formatThaiDate(order.createdAt)}) →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
