import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { TripListItem } from "@/types";
import MoneyValue from "../money-value";
import TripStatusBadge from "../results/trip-status-badge";
import { formatDate, tripDriverName, tripVehicleTitle } from "../utils";
import DetailRow from "./detail-row";
import { vehicleTypeLabel } from "@/lib/utils/vehicle-type";

function formatDistance(value?: number | string | null) {
  if (value == null || value === "") return "-";
  const distance = Number(value);
  if (!Number.isFinite(distance)) return String(value);
  if (distance < 0.01) return `${Math.round(distance * 1000)} متر`;
  return `${new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(distance)} كم`;
}

function TripBasicInfo({ trip }: { trip: TripListItem }) {
  const hasAutoStopError =
    (trip.status === "started" || trip.status === "in_progress") &&
    Boolean(trip.auto_stop_last_error);
  const isNegativeNonScooter =
    trip.vehicle_type !== "scooter" &&
    trip.remaining_balance != null &&
    Number(trip.remaining_balance) < 0;

  return (
    <>
      {(trip.auto_stopped_at || hasAutoStopError || isNegativeNonScooter) && (
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
          {isNegativeNonScooter && (
            <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
              رصيد سالب ({vehicleTypeLabel(trip.vehicle_type)}) — تستمر الرحلة حتى ينهيها السائق أو المشرف
            </p>
          )}
        </section>
      )}
      <section className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="رقم الرحلة" value={<span dir="ltr">{trip.id}</span>} />
        <DetailRow label="الحالة" value={<TripStatusBadge status={trip.status} />} />
        <DetailRow label="نوع المركبة" value={vehicleTypeLabel(trip.vehicle_type)} />
        <DetailRow label="المسافة" value={formatDistance(trip.distance)} />
        <DetailRow label="تاريخ إنشاء الرحلة" value={<span dir="ltr">{formatDate(trip.created_at)}</span>} />
        {trip.auto_stop_attempts != null && (
          <DetailRow label="محاولات الإيقاف التلقائي" value={trip.auto_stop_attempts} />
        )}
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
          <DetailRow label="البريد الإلكتروني" value={trip.driver.email ?? "-"} />
          <DetailRow label="حالة الحساب" value={trip.driver.active == null ? "-" : trip.driver.active ? "نشط" : "غير نشط"} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-semibold text-secondary">المركبة</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="المركبة" value={tripVehicleTitle(trip.vehicle)} />
          <DetailRow label="حالة المركبة" value={trip.vehicle.status ?? "-"} />
          <DetailRow label="نسبة البطارية" value={trip.vehicle.battery_percentage != null ? `${trip.vehicle.battery_percentage}%` : "-"} />
          <DetailRow label="نوع التشغيل" value={trip.vehicle.operating_type ?? "-"} />
          <DetailRow label="معرّف جهاز IoT" value={<span dir="ltr">{trip.vehicle.iot_device_id ?? "-"}</span>} />
        </div>
      </section>
    </>
  );
}

export default TripBasicInfo;
