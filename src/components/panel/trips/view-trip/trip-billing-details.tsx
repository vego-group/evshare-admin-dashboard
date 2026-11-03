import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";

import type { TripListItem } from "@/types";

import MoneyValue from "../money-value";
import { formatDate, formatDuration, tripPricing } from "../utils";
import DetailRow from "./detail-row";

function TripBillingDetails({ trip }: { trip: TripListItem }) {
  const pricing = tripPricing(trip);
  const breakdown = trip.cost_breakdown;
  const isActiveTrip = trip.status === "started" || trip.status === "in_progress";
  const price = Number(trip.price);
  const commission = Number(trip.commission);
  const ownerEarning = trip.price != null && trip.commission != null && Number.isFinite(price) && Number.isFinite(commission)
    ? price - commission
    : null;
  return (
    <section className="space-y-4" aria-labelledby="trip-billing-title">
      <div>
        <h3 id="trip-billing-title" className="font-semibold text-secondary">التسعير والتسوية</h3>
        <p className="mt-1 text-sm leading-6 text-gray">
          السعر يحدده الخادم من رسوم الفتح ووحدات الوقت التي بدأت. المسافة لا تدخل في فوترة الرحلة.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <BillingStat
          icon={<Clock3 className="size-4" aria-hidden="true" />}
          label={isActiveTrip ? "السعر حتى آخر تحديث موقع" : "السعر النهائي"}
          value={<MoneyValue value={trip.price} currency={pricing.currency} />}
          emphasis
        />
        <BillingStat
          label="رسوم الفتح"
          value={<MoneyValue value={pricing.unlock_fee} currency={pricing.currency} />}
        />
        <BillingStat
          label={breakdown ? "تكلفة الوقت" : "سعر الدقيقة المثبت"}
          value={
            <MoneyValue
              value={breakdown?.time_cost ?? pricing.price_per_minute}
              currency={pricing.currency}
            />
          }
        />
      </div>

      {isActiveTrip ? (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
          <Clock3 className="mt-1 size-4 shrink-0" aria-hidden="true" />
          <p>
            هذه قيمة مباشرة حتى آخر نبضة موقع استلمها الخادم، وليست عداداً محلياً. سيعيد الخادم حساب القيمة النهائية لحظة إنهاء الرحلة.
          </p>
        </div>
      ) : trip.status === "completed" ? (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
          <ShieldCheck className="mt-1 size-4 shrink-0" aria-hidden="true" />
          <p>
            سُجلت رسوم الفتح عند البدء وتكلفة الوقت عند الانتهاء. تسوية الخادم محمية من التكرار، لذلك لا يؤدي تكرار طلب الإنهاء إلى خصم جديد.
          </p>
        </div>
      ) : null}

      {pricing.price_per_minute == null ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <AlertTriangle className="mt-1 size-4 shrink-0" aria-hidden="true" />
          <p>
            لا تعرض الاستجابة سعر الدقيقة المثبت. تحقق من تسعير المركبة أو المنتج؛ قد يستخدم الخادم السعر الاحتياطي 2.50 ر.س/دقيقة عند غياب الإعدادين.
          </p>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="سعر الدقيقة" value={<MoneyValue value={pricing.price_per_minute ?? trip.vehicle.price_per_minute} currency={pricing.currency} />} />
        <DetailRow label="احتساب المسافة" value="غير محتسبة في سعر الرحلة" />
        <DetailRow label="العمولة" value={<MoneyValue value={trip.commission} currency={pricing.currency} />} />
        {trip.status === "completed" && ownerEarning !== null && (
          <DetailRow label="أرباح مالك المركبة" value={<MoneyValue value={ownerEarning} currency={pricing.currency} />} />
        )}
        <DetailRow label="نسبة عمولة المركبة" value={trip.vehicle.commission_percentage != null ? `${trip.vehicle.commission_percentage}%` : "-"} />
        <DetailRow label="وحدة الاحتساب" value={formatDuration(pricing.billing_increment_seconds)} />
        <DetailRow label="الحد الأدنى للتكلفة" value={<MoneyValue value={pricing.minimum_charge} currency={pricing.currency} />} />
        <DetailRow label="الرصيد قبل الرحلة" value={<MoneyValue value={pricing.balance_before} currency={pricing.currency} />} />
        <DetailRow label="تثبيت التسعيرة" value={<span dir="ltr">{formatDate(pricing.pricing_locked_at)}</span>} />
        <DetailRow label="إصدار التسعير" value={pricing.configuration_version != null ? String(pricing.configuration_version) : "-"} />
        <DetailRow label="مستأجر التسعير" value={pricing.tenant || "-"} />
        <DetailRow label="بداية سريان التسعير" value={<span dir="ltr">{formatDate(pricing.effective_at)}</span>} />
      </div>
      {breakdown && (
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="رسوم أخرى" value={<MoneyValue value={breakdown.other_charges} currency={pricing.currency} />} />
          <DetailRow label="الضريبة (ضمن الإجمالي)" value={<MoneyValue value={breakdown.vat_amount} currency={pricing.currency} />} />
          <DetailRow label="الإجمالي" value={<MoneyValue value={breakdown.total ?? trip.price} currency={pricing.currency} />} />
        </div>
      )}
      {!breakdown && (
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="الإجمالي" value={<MoneyValue value={trip.price} currency={pricing.currency} />} />
        </div>
      )}
      {trip.cancellation && (
        <div className="rounded-[10px] border border-primary/15 bg-primary/5 p-3 text-sm">
          <p className="font-medium text-secondary">{trip.cancellation.unlock_fee_refunded ? "تم رد رسوم الفتح" : "لم يتم رد رسوم الفتح"}</p>
          {trip.cancellation.reason && <p className="mt-1 text-gray">{trip.cancellation.reason}</p>}
        </div>
      )}
    </section>
  );
}

function BillingStat({
  icon,
  label,
  value,
  emphasis = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className={emphasis ? "rounded-xl border border-primary/25 bg-primary/8 p-4" : "rounded-xl border border-neutral-100 bg-white p-4 shadow-sm"}>
      <p className="flex items-center gap-2 text-xs text-gray">
        {icon}
        {label}
      </p>
      <div className="mt-2 text-lg font-semibold text-secondary">{value}</div>
    </div>
  );
}

export default TripBillingDetails;
