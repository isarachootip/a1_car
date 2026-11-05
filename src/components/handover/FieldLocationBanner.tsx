"use client";

import React from "react";
import { MapPin, PhoneCall, Navigation, CalendarClock, Building2 } from "lucide-react";
import {
  buildGoogleMapsSearchUrl,
  formatTelHref,
} from "@/lib/domain/handoverRules";
import { ServiceLocationType } from "@/lib/types/handover";

export interface FieldLocationValues {
  serviceLocationType: ServiceLocationType;
  pickupLocation: string;
  pickupMapUrl: string;
  scheduledAt: string;
}

interface FieldLocationBannerProps {
  customerName: string;
  customerPhone: string;
  values: FieldLocationValues;
  disabled: boolean;
  onChange: <K extends keyof FieldLocationValues>(
    key: K,
    val: FieldLocationValues[K]
  ) => void;
}

export function FieldLocationBanner({
  customerName,
  customerPhone,
  values,
  disabled,
  onChange,
}: FieldLocationBannerProps) {
  const mapHref = buildGoogleMapsSearchUrl(
    values.pickupLocation,
    values.pickupMapUrl
  );
  const telHref = formatTelHref(customerPhone);

  return (
    <section className="bg-white border border-slate-300 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("serviceLocationType", "ON_SITE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border transition ${
              values.serviceLocationType === "ON_SITE"
                ? "bg-slate-900 text-amber-400 border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-300"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            ไปรับ-ส่งรถที่ Site ลูกค้า
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("serviceLocationType", "AT_BRANCH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border transition ${
              values.serviceLocationType === "AT_BRANCH"
                ? "bg-slate-900 text-amber-400 border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-300"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            รับรถที่สาขา
          </button>
        </div>

        {/* Quick Mobile Action Buttons for On-Site Staff */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <a
            href={telHref}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            โทรหาลูกค้า ({customerPhone || "-"})
          </a>
          {mapHref && (
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              นำทาง Google Maps
            </a>
          )}
        </div>
      </div>

      {values.serviceLocationType === "ON_SITE" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-sm">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              📍 สถานที่นัดรับ-ส่งรถ (ชื่อหมู่บ้าน/อาคาร/ซอย)
            </label>
            <input
              type="text"
              disabled={disabled}
              value={values.pickupLocation}
              onChange={(e) => onChange("pickupLocation", e.target.value)}
              placeholder={`สถานที่รับรถของ ${customerName || "ลูกค้า"}`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              🗺️ ลิงก์พิกัด Google Maps (ถ้ามี)
            </label>
            <input
              type="url"
              disabled={disabled}
              value={values.pickupMapUrl}
              onChange={(e) => onChange("pickupMapUrl", e.target.value)}
              placeholder="วางลิงก์ https://maps.app.goo.gl/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ⏰ วัน-เวลานัดหมายรับรถ
            </label>
            <div className="relative">
              <CalendarClock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled={disabled}
                value={values.scheduledAt}
                onChange={(e) => onChange("scheduledAt", e.target.value)}
                placeholder="เช่น วันนี้ 10:30 น."
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 pt-3">
          🏢 โหมดรับรถที่สาขา: ลูกค้านำรถเข้ามาส่งมอบหรือรับบริการที่ศูนย์บริการสาขาโดยตรง
        </p>
      )}
    </section>
  );
}
