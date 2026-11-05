export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface PlaceSuggestion {
  placeId: string;
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
}

export const BRANCH_COORDINATES: Record<string, GeoPoint> = {
  "BKK-RAMA3": { lat: 13.6969, lng: 100.5389 }, // โลตัส พระราม 3
  "BKK-BANGNA": { lat: 13.6466, lng: 100.6803 }, // เมกา บางนา
  "NON-CHAENG": { lat: 13.9039, lng: 100.5257 }, // โรบินสัน แจ้งวัฒนะ
};

export function buildGoogleMapsCoordUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${Number(lat.toFixed(6))},${Number(lng.toFixed(6))}`;
}

export function extractCoordinatesFromText(input: string): GeoPoint | null {
  if (!input) return null;
  const regex = /(-?\d{1,2}\.\d{3,10})\s*,\s*(-?\d{2,3}\.\d{3,10})/;
  const match = input.match(regex);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadEstimateKm = R * c * 1.2; // 1.2x road routing factor
  return Math.round(roadEstimateKm * 10) / 10;
}

export interface BranchDistanceEvaluation {
  distanceKm: number;
  isOver20Km: boolean;
  extraKm: number;
}

export function evaluateBranchDistance(
  branchCode: string | undefined,
  targetLat: number,
  targetLng: number
): BranchDistanceEvaluation | null {
  const origin =
    (branchCode ? BRANCH_COORDINATES[branchCode] : undefined) ??
    BRANCH_COORDINATES["BKK-RAMA3"];
  if (!origin) return null;

  const distanceKm = calculateDistanceKm(
    origin.lat,
    origin.lng,
    targetLat,
    targetLng
  );
  const isOver20Km = distanceKm > 20;
  const extraKm = isOver20Km ? Math.round((distanceKm - 20) * 10) / 10 : 0;

  return {
    distanceKm,
    isOver20Km,
    extraKm,
  };
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
