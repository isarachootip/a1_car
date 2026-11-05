"use client";

import React, { useEffect, useState } from "react";
import { Search, LocateFixed, MapPin, CalendarClock, Eye, EyeOff } from "lucide-react";
import {
  buildGoogleMapsCoordUrl,
  extractCoordinatesFromText,
  PlaceSuggestion,
} from "@/lib/domain/geoCalculator";
import { MapPreviewFrame } from "./MapPreviewFrame";

interface LocationMapPickerProps {
  branchCode?: string;
  pickupLocation: string;
  pickupMapUrl: string;
  scheduledAt: string;
  disabled?: boolean;
  onChangeLocation: (loc: string) => void;
  onChangeMapUrl: (url: string) => void;
  onChangeScheduledAt: (time: string) => void;
}

export function LocationMapPicker({
  branchCode,
  pickupLocation,
  pickupMapUrl,
  scheduledAt,
  disabled,
  onChangeLocation,
  onChangeMapUrl,
  onChangeScheduledAt,
}: LocationMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() =>
    extractCoordinatesFromText(pickupMapUrl)
  );

  useEffect(() => {
    const parsed = extractCoordinatesFromText(pickupMapUrl);
    if (parsed) setCoords(parsed);
  }, [pickupMapUrl]);

  const handleSearch = async (queryText?: string) => {
    const q = (queryText ?? searchQuery).trim();
    if (q.length < 2) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`);
      const json = (await res.json()) as { places?: PlaceSuggestion[] };
      setSuggestions(json.places ?? []);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPlace = (place: PlaceSuggestion) => {
    onChangeLocation(place.displayName);
    onChangeMapUrl(buildGoogleMapsCoordUrl(place.lat, place.lng));
    setCoords({ lat: place.lat, lng: place.lng });
    setSuggestions([]);
    setSearchQuery("");
    setShowMap(true);
  };

  const handleUseCurrentGps = () => {
    if (disabled || typeof navigator === "undefined" || !navigator.geolocation) return;
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        onChangeMapUrl(buildGoogleMapsCoordUrl(lat, lng));
        try {
          const res = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
          const json = (await res.json()) as { place?: PlaceSuggestion };
          if (json.place) onChangeLocation(json.place.displayName);
        } finally {
          setLocatingGps(false);
          setShowMap(true);
        }
      },
      () => setLocatingGps(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2.5 text-xs">
      {!disabled && (
        <div>
          <label className="block font-bold text-slate-800 mb-1">
            🔍 ค้นหาชื่อสถานที่จากแผนที่ (พิมพ์ชื่อหมู่บ้าน / คอนโด / อาคาร / ถนน)
          </label>
          <div className="flex flex-wrap sm:flex-nowrap gap-1.5">
            <div className="relative flex-1 min-w-[190px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="พิมพ์ค้นหา เช่น หมู่บ้านลัดดารมย์, เมกาบางนา, สาธุประดิษฐ์..."
                className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 bg-white text-slate-900"
              />
            </div>
            <button type="button" disabled={searching} onClick={() => handleSearch(searchQuery)} className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold shrink-0">
              {searching ? "กำลังค้นหา..." : "ค้นหาแผนที่"}
            </button>
            <button type="button" disabled={locatingGps} onClick={handleUseCurrentGps} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1 shrink-0">
              <LocateFixed className="w-3.5 h-3.5" />
              {locatingGps ? "กำลังดึงพิกัด..." : "พิกัด GPS ปัจจุบัน"}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-1.5 bg-white border border-slate-300 rounded-xl shadow-lg divide-y divide-slate-100 max-h-48 overflow-y-auto z-30 relative">
              {suggestions.map((s) => (
                <button key={s.placeId} type="button" onClick={() => handleSelectPlace(s)} className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-start gap-2 transition">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{s.shortName}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{s.displayName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2">
          <label className="block font-bold text-slate-800 mb-1">📍 สถานที่นัดรับ-ส่งรถ (แก้ไขรายละเอียดบ้านเลขที่/ซอยเพิ่มได้)</label>
          <input type="text" disabled={disabled} value={pickupLocation} onChange={(e) => onChangeLocation(e.target.value)} placeholder="ระบุชื่อสถานที่ บ้านเลขที่ ซอย หรือเลือกจากช่องค้นหาด้านบน" className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white disabled:bg-slate-100" />
        </div>
        <div>
          <label className="block font-bold text-slate-800 mb-1">⏰ วัน-เวลานัดหมาย</label>
          <div className="relative">
            <CalendarClock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input type="text" disabled={disabled} value={scheduledAt} onChange={(e) => onChangeScheduledAt(e.target.value)} placeholder="เช่น วันนี้ 13:30 น." className="w-full rounded-lg border border-slate-300 pl-8 pr-2.5 py-1.5 bg-white disabled:bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-end gap-2">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-bold text-slate-800 mb-1">🗺️ ลิงก์พิกัด Google Maps (สร้างอัตโนมัติเมื่อเลือกสถานที่ หรือวางลิงก์เองได้)</label>
          <input type="url" disabled={disabled} value={pickupMapUrl} onChange={(e) => onChangeMapUrl(e.target.value)} placeholder="https://www.google.com/maps?q=..." className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white font-mono text-[11px] disabled:bg-slate-100" />
        </div>
        {coords && (
          <button type="button" onClick={() => setShowMap((v) => !v)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold inline-flex items-center gap-1">
            {showMap ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showMap ? "ซ่อนแผนที่" : "ดูแผนที่"}
          </button>
        )}
      </div>

      {coords && showMap && (
        <MapPreviewFrame
          lat={coords.lat}
          lng={coords.lng}
          branchCode={branchCode}
          disabled={disabled}
          onNudgeCoord={(dLat, dLng) => {
            const nextLat = coords.lat + dLat;
            const nextLng = coords.lng + dLng;
            setCoords({ lat: nextLat, lng: nextLng });
            onChangeMapUrl(buildGoogleMapsCoordUrl(nextLat, nextLng));
          }}
        />
      )}
    </div>
  );
}
