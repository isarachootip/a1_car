"use client";

import React from "react";
import { MapPin, PhoneCall, Navigation, Building2 } from "lucide-react";
import {
  buildGoogleMapsSearchUrl,
  formatTelHref,
} from "@/lib/domain/handoverRules";
import { ServiceLocationType } from "@/lib/types/handover";
import { LocationMapPicker } from "./LocationMapPicker";

export interface FieldLocationValues {
  serviceLocationType: ServiceLocationType;
  pickupLocation: string;
  pickupMapUrl: string;
  scheduledAt: string;
}

interface FieldLocationBannerProps {
  branchCode?: string;
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
  branchCode,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
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
        <LocationMapPicker
          branchCode={branchCode}
          pickupLocation={values.pickupLocation}
          pickupMapUrl={values.pickupMapUrl}
          scheduledAt={values.scheduledAt}
          disabled={disabled}
          onChangeLocation={(loc) => onChange("pickupLocation", loc)}
          onChangeMapUrl={(url) => onChange("pickupMapUrl", url)}
          onChangeScheduledAt={(time) => onChange("scheduledAt", time)}
        />
      ) : (
        <p className="text-xs text-slate-500">
          🏢 โหมดรับรถที่สาขา: ลูกค้านำรถเข้ามาส่งมอบหรือรับบริการที่ศูนย์บริการสาขาโดยตรง
        </p>
      )}
    </section>
  );
}
