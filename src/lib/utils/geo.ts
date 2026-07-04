export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function formatDistanceParts(km: number): { value: string; unit: string } {
  if (km < 1) return { value: String(Math.round(km * 1000)), unit: "م" };
  return { value: km.toFixed(1), unit: "كم" };
}
