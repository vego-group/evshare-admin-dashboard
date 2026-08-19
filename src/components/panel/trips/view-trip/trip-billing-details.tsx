import type { TripListItem } from "@/types";

import MoneyValue from "../money-value";
import { formatDate, formatDuration, tripPricing } from "../utils";
import DetailRow from "./detail-row";

function TripBillingDetails({ trip }: { trip: TripListItem }) {
  const pricing = tripPricing(trip);
  const breakdown = trip.cost_breakdown;
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-secondary">التسعير والتسوية</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <DetailRow label="رسوم فتح الرحلة" value={<MoneyValue value={pricing.unlock_fee} currency={pricing.currency} />} />
        <DetailRow label="سعر الدقيقة" value={<MoneyValue value={pricing.price_per_minute} currency={pricing.currency} />} />
        <DetailRow label="وحدة الاحتساب" value={formatDuration(pricing.billing_increment_seconds)} />
        <DetailRow label="الحد الأدنى للتكلفة" value={<MoneyValue value={pricing.minimum_charge} currency={pricing.currency} />} />
        <DetailRow label="الرصيد قبل الرحلة" value={<MoneyValue value={pricing.balance_before} currency={pricing.currency} />} />
        <DetailRow label="تثبيت التسعيرة" value={<span dir="ltr">{formatDate(pricing.pricing_locked_at)}</span>} />
      </div>
      {breakdown && (
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="تكلفة الوقت" value={<MoneyValue value={breakdown.time_cost} currency={pricing.currency} />} />
          <DetailRow label="رسوم أخرى" value={<MoneyValue value={breakdown.other_charges} currency={pricing.currency} />} />
          <DetailRow label="الضريبة (ضمن الإجمالي)" value={<MoneyValue value={breakdown.vat_amount} currency={pricing.currency} />} />
          <DetailRow label="الإجمالي" value={<MoneyValue value={breakdown.total ?? trip.price} currency={pricing.currency} />} />
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

export default TripBillingDetails;
