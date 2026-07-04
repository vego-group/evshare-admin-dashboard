import type { TripListItem } from "@/types";
import TripStatusBadge from "../results/trip-status-badge";
import { formatDate, tripDriverName, tripVehicleTitle } from "../utils";
import DetailRow from "./detail-row";

function TripBasicInfo({ trip }: { trip: TripListItem }) {
  return (
    <>
      <section className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="رقم الرحلة" value={<span dir="ltr">{trip.id}</span>} />
        <DetailRow label="الحالة" value={<TripStatusBadge status={trip.status} />} />
        <DetailRow label="وقت البدء" value={<span dir="ltr">{formatDate(trip.date_time.start)}</span>} />
        <DetailRow label="وقت الانتهاء" value={<span dir="ltr">{formatDate(trip.date_time.end)}</span>} />
      </section>

      <section>
        <h3 className="mb-3 font-semibold text-secondary">السائق</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="الاسم" value={tripDriverName(trip.driver)} />
          <DetailRow label="رقم الجوال" value={<span dir="ltr">{trip.driver.mobile ?? "-"}</span>} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-semibold text-secondary">المركبة</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="المركبة" value={tripVehicleTitle(trip.vehicle)} />
          <DetailRow label="حالة المركبة" value={trip.vehicle.status ?? "-"} />
          <DetailRow label="نسبة البطارية" value={trip.vehicle.battery_percentage != null ? `${trip.vehicle.battery_percentage}%` : "-"} />
        </div>
      </section>
    </>
  );
}

export default TripBasicInfo;
