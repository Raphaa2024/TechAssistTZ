/**
 * TechAssistTZ - backend/src/utils/geo.js
 * Kanuni ya GPS (Haversine Formula) kupima umbali wa fundi na mteja kwa kilomita (km).
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates straight-line distance in kilometers using the Haversine formula.
 */
export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  return Math.round(distanceKm * 10) / 10;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Real coordinates for Dar es Salaam wards in TechAssistTZ.
 */
export const WARD_COORDINATES: Record<string, Coordinates> = {
  'Kinondoni': { lat: -6.7864, lng: 39.2625 },
  'Sinza': { lat: -6.7801, lng: 39.2223 },
  'Mwenge': { lat: -6.7689, lng: 39.2294 },
  'Mikocheni': { lat: -6.7554, lng: 39.2519 },
  'Mbezi Beach': { lat: -6.7023, lng: 39.2198 },
  'Tegeta': { lat: -6.6543, lng: 39.1832 }, // ~16.5 km from central
  'Kariakoo': { lat: -6.8243, lng: 39.2748 },
  'Posta / CBD': { lat: -6.8161, lng: 39.2891 },
  'Ubungo': { lat: -6.7909, lng: 39.2078 },
  'Tabata': { lat: -6.8378, lng: 39.2299 },
  'Temeke': { lat: -6.8624, lng: 39.2711 },
};

export interface DistanceResult {
  km: number;
  isFar: boolean;
  transitMinutes: number;
  transportFee: number;
}

export function calculateTechAssistDistance(
  ward1Name: string, 
  ward2Name: string,
  gridFallbackKm?: number
): DistanceResult {
  const coord1 = WARD_COORDINATES[ward1Name] || { lat: -6.7864, lng: 39.2625 };
  const coord2 = WARD_COORDINATES[ward2Name] || { lat: -6.7801, lng: 39.2223 };

  let km = haversineDistance(coord1, coord2);
  if (km < 1.0) {
    km = gridFallbackKm || 1.8; // minimum travel distance inside city ward
  }

  // Account for road network winding factor (approx 1.3x straight line)
  const roadKm = Math.round(km * 1.3 * 10) / 10;
  
  // Far distance threshold in city: >= 8.5 km
  const isFar = roadKm >= 8.5;

  // Travel time in Dar es Salaam traffic (approx 18 km/h + 6 min preparation)
  const transitMinutes = Math.round(6 + (roadKm / 18) * 60);

  // Transport fee: base TZS 3,000 + TZS 750 per km
  const transportFee = Math.round(3000 + roadKm * 750);

  return { km: roadKm, isFar, transitMinutes, transportFee };
}
