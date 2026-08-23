import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { TripListItem } from "@/types";
import MoneyValue from "../money-value";
import TripStatusBadge from "../results/trip-status-badge";
import { formatDate, tripDriverName, tripVehicleTitle } from "../utils";
import DetailRow from "./detail-row";

function TripBasicInfo({ trip }: { trip: TripListItem }) {
  const hasAutoStopError =
    (trip.status === "started" || trip.status === "in_progress") &&
    Boolean(trip.auto_stop_last_error);
  const isNegativeBike =
    trip.vehicle_type === "bike" &&
    trip.remaining_balance != null &&
    Number(trip.remaining_balance) < 0;

  return (
    <>
      {(trip.auto_stopped_at || hasAutoStopError || isNegativeBike) && (
        <section className="space-y-2">
          {trip.auto_stopped_at && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-orange-600">
              تم الإيقاف تلقائياً بسبب عدم كفاية الرصيد
            </p>
          )}
          {hasAutoStopError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              فشل الإيقاف التلقائي — المحاولة {trip.auto_stop_attempts}: {trip.auto_stop_last_error}
            </p>
          )}
          {isNegativeBike && (
            <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
              رصيد سالب (دراجة) — تستمر الرحلة حتى ينهيها السائق أو المشرف
            </p>
          )}
        </section>
      )}
      <section className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="رقم الرحلة" value={<span dir="ltr">{trip.id}</span>} />
        <DetailRow label="الحالة" value={<TripStatusBadge status={trip.status} />} />
        <DetailRow label="نوع المركبة" value={trip.vehicle_type === "bike" ? "دراجة" : "سكوتر"} />
        <DetailRow label="محاولات الإيقاف التلقائي" value={trip.auto_stop_attempts} />
        <DetailRow label="آخر محاولة إيقاف" value={<span dir="ltr">{formatDate(trip.auto_stop_last_attempt_at)}</span>} />
        <DetailRow label="وقت البدء" value={<span dir="ltr">{formatDate(trip.date_time.start)}</span>} />
        <DetailRow label="وقت الانتهاء" value={<span dir="ltr">{formatDate(trip.date_time.end)}</span>} />
        <DetailRow
          label="السعر"
          value={<MoneyValue value={trip.price} currency={trip.currency} />}
        />
      </section>

      <section>
        <h3 className="mb-3 font-semibold text-secondary">السائق</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="الاسم" value={tripDriverName(trip.driver)} />
          <DetailRow
            label="رقم الجوال"
            value={<span dir="ltr">{trip.driver.mobile ? formatSaudiPhoneNumber(trip.driver.mobile) : "-"}</span>}
          />
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
