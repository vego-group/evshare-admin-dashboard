import type { TripListItem } from "@/types";
import DetailRow from "./detail-row";

function formatCoordinate(coordinate: { latitude: number; longitude: number } | null) {
  if (!coordinate) return "-";
  return `${coordinate.latitude}, ${coordinate.longitude}`;
}

function TripLocations({ trip }: { trip: TripListItem }) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-secondary">المواقع</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="نقطة الانطلاق" value={<span dir="ltr">{formatCoordinate(trip.pickup_location)}</span>} />
        <DetailRow label="نقطة الوصول" value={<span dir="ltr">{formatCoordinate(trip.drop_off_location)}</span>} />
        <DetailRow label="الموقع الحالي" value={<span dir="ltr">{formatCoordinate(trip.live_location)}</span>} />
        <DetailRow label="عدد نقاط المسار" value={trip.route.length} />
      </div>
    </section>
  );
}

export default TripLocations;
