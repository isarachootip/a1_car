import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PlaceSuggestion } from "@/lib/domain/geoCalculator";

const searchQuerySchema = z.object({
  q: z.string().min(2).max(200),
});

const reverseQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

const nominatimItemSchema = z.object({
  place_id: z.union([z.number(), z.string()]),
  display_name: z.string(),
  name: z.string().optional(),
  lat: z.string(),
  lon: z.string(),
});

const FALLBACK_THAI_PLACES: PlaceSuggestion[] = [
  {
    placeId: "fb-1",
    shortName: "เซ็นทรัล พระราม 3 (Central Rama 3)",
    displayName: "เซ็นทรัล พระราม 3 ถนนสาธุประดิษฐ์ ยานนาวา กรุงเทพมหานคร",
    lat: 13.6962,
    lng: 100.5338,
  },
  {
    placeId: "fb-2",
    shortName: "เมกา บางนา (Mega Bangna)",
    displayName: "เมกา บางนา ถนนเทพรัตน บางพลี สมุทรปราการ",
    lat: 13.6466,
    lng: 100.6803,
  },
  {
    placeId: "fb-3",
    shortName: "เซ็นทรัล แจ้งวัฒนะ (Central Chaengwattana)",
    displayName: "เซ็นทรัล แจ้งวัฒนะ ปากเกร็ด นนทบุรี",
    lat: 13.9038,
    lng: 100.5282,
  },
  {
    placeId: "fb-4",
    shortName: "ไอคอนสยาม (ICONSIAM)",
    displayName: "ไอคอนสยาม ถนนเจริญนคร คลองสาน กรุงเทพมหานคร",
    lat: 13.7267,
    lng: 100.5105,
  },
];

export async function GET(req: NextRequest): Promise<NextResponse> {
  const q = req.nextUrl.searchParams.get("q");
  const latParam = req.nextUrl.searchParams.get("lat");
  const lngParam = req.nextUrl.searchParams.get("lng");

  if (latParam !== null && lngParam !== null) {
    const parsedRev = reverseQuerySchema.safeParse({
      lat: latParam,
      lng: lngParam,
    });
    if (!parsedRev.success) {
      return NextResponse.json({ error: "พิกัดไม่ถูกต้อง" }, { status: 400 });
    }
    const { lat, lng } = parsedRev.data;
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=th&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "AUTO1-Pickup-Delivery/1.0" },
        signal: AbortSignal.timeout(4500),
      });
      const raw: unknown = await res.json();
      const parsedItem = nominatimItemSchema.safeParse(raw);
      if (parsedItem.success) {
        const item = parsedItem.data;
        const place: PlaceSuggestion = {
          placeId: String(item.place_id),
          shortName:
            item.name || item.display_name.split(",")[0] || "ตำแหน่งที่เลือก",
          displayName: item.display_name,
          lat: Number(item.lat),
          lng: Number(item.lon),
        };
        return NextResponse.json({ place });
      }
    } catch {
      // Fallback below
    }
    return NextResponse.json({
      place: {
        placeId: "gps-point",
        shortName: `พิกัด GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
        displayName: `พิกัด GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
        lat,
        lng,
      },
    });
  }

  const parsedSearch = searchQuerySchema.safeParse({ q: q ?? "" });
  if (!parsedSearch.success) {
    return NextResponse.json({ places: [] });
  }

  const query = parsedSearch.data.q.trim();
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=th&limit=6&accept-language=th&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AUTO1-Pickup-Delivery/1.0" },
      signal: AbortSignal.timeout(4500),
    });
    const rawList: unknown = await res.json();
    const parsedList = z.array(nominatimItemSchema).safeParse(rawList);
    if (parsedList.success && parsedList.data.length > 0) {
      const places: PlaceSuggestion[] = parsedList.data.map((item) => ({
        placeId: String(item.place_id),
        shortName:
          item.name ||
          item.display_name.split(",").slice(0, 2).join(" ").trim(),
        displayName: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));
      return NextResponse.json({ places });
    }
  } catch {
    // Fallback below
  }

  const lower = query.toLowerCase();
  const matched = FALLBACK_THAI_PLACES.filter(
    (p) =>
      p.displayName.toLowerCase().includes(lower) ||
      p.shortName.toLowerCase().includes(lower)
  );
  return NextResponse.json({ places: matched });
}
