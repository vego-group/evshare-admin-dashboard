"use client";

import { SaudiRiyal, Users } from "lucide-react";
import type { ReactNode } from "react";

import type { PromoDetailData, PromoRedeemableType } from "@/types";

import PromoDetailsShimmer from "../modals/promo-details-shimmer";
import {
  DiscountValue,
  formatDate,
  formatPeriod,
  formatUsage,
  PromoIcon,
  StatusBadge,
  TypeBadge,
} from "../results/promo-result-parts";

type Props = {
  detail?: PromoDetailData;
  isLoading: boolean;
};

const redeemableTypeLabels: Record<NonNullable<PromoRedeemableType>, string> = {
  Order: "طلب",
  Subscription: "اشتراك",
};

export function PromoDetailsContent({ detail, isLoading }: Props) {
  if (isLoading) return <PromoDetailsShimmer />;

  if (!detail) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        تعذر تحميل تفاصيل كود الخصم.
      </div>
    );
  }

  const { promo, analytics, recent_redemptions } = detail;

  return (
    <div className="flex min-w-0 flex-col gap-6 text-right">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[14px] bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <PromoIcon />
          <div className="space-y-2">
            <h3 className="w-full break-all text-xl font-bold text-secondary" dir="ltr">
              {promo.code}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={promo.type} />
              <StatusBadge promo={promo} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الاستخدامات" value={String(analytics.total_redemptions)} />
        <StatCard label="عدد المستخدمين الفريدين" value={String(analytics.unique_users)} />
        <StatCard
          label="إجمالي الخصومات الممنوحة"
          value={
            <span className="inline-flex items-center gap-1" dir="ltr">
              <SaudiRiyal className="size-4 shrink-0" /> {analytics.total_discount_given}
            </span>
          }
        />
        <StatCard
          label="الاستخدامات المتبقية"
          value={analytics.remaining_uses === null ? "غير محدود" : String(analytics.remaining_uses)}
        />
      </section>

      {/* Main info */}
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">البيانات الأساسية</h4>
        <DetailRow
          label="قيمة الخصم"
          value={<DiscountValue promo={promo} />}
        />
        <DetailRow
          label="الحد الأقصى لمبلغ الخصم"
          value={<MoneyValue value={promo.max_discount_amount} />}
        />
        <DetailRow
          label="الحد الأدنى لمبلغ الطلب"
          value={<MoneyValue value={promo.minimum_order_amount} />}
        />
        <DetailRow label="الاستخدام" value={formatUsage(promo)} />
        <DetailRow
          label="الحد الأقصى للاستخدام لكل مستخدم"
          value={promo.per_user_limit === null ? "غير محدود" : String(promo.per_user_limit)}
        />
        <DetailRow label="الفترة" value={formatPeriod(promo)} />
        <DetailRow label="تاريخ الإنشاء" value={formatDate(promo.created_at)} />
      </section>

      {/* Descriptions */}
      {(promo.description_ar || promo.description_en) && (
        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <h4 className="text-sm font-semibold text-secondary">الأوصاف</h4>
          <DetailRow label="الوصف بالعربية" value={promo.description_ar} />
          <DetailRow label="الوصف بالإنجليزية" value={promo.description_en} />
        </section>
      )}

      {/* Recent redemptions */}
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">أحدث عمليات الاستخدام</h4>
        {recent_redemptions.length === 0 ? (
          <div className="flex min-h-30 items-center justify-center rounded-[10px] bg-white px-4 text-center text-sm text-gray">
            لا توجد عمليات استخدام لهذا الكود بعد.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] bg-white">
            <table className="w-full min-w-150 border-separate border-spacing-0 text-right">
              <thead>
                <tr className="text-sm font-semibold text-dark-gray">
                  <RedemptionHeaderCell>المستخدم</RedemptionHeaderCell>
                  <RedemptionHeaderCell>رقم الجوال</RedemptionHeaderCell>
                  <RedemptionHeaderCell>النوع</RedemptionHeaderCell>
                  <RedemptionHeaderCell>قيمة الخصم</RedemptionHeaderCell>
                  <RedemptionHeaderCell>التاريخ</RedemptionHeaderCell>
                </tr>
              </thead>
              <tbody>
                {recent_redemptions.map((redemption) => (
                  <tr key={redemption.id} className="text-sm text-dark-gray">
                    <RedemptionCell>
                      <span className="inline-flex items-center gap-2">
                        <Users className="size-4 shrink-0 text-secondary" />
                        {redemption.user.name}
                      </span>
                    </RedemptionCell>
                    <RedemptionCell dir="ltr">{redemption.user.mobile}</RedemptionCell>
                    <RedemptionCell>
                      {redemption.redeemable_type
                        ? redeemableTypeLabels[redemption.redeemable_type]
                        : "-"}
                    </RedemptionCell>
                    <RedemptionCell dir="ltr">
                      <span className="inline-flex items-center gap-1">
                        <SaudiRiyal className="size-4 shrink-0" />
                        {redemption.discount_amount_applied}
                      </span>
                    </RedemptionCell>
                    <RedemptionCell dir="ltr">{formatDate(redemption.created_at)}</RedemptionCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-background p-4">
      <span className="text-sm text-gray">{label}</span>
      <span className="text-lg font-bold text-secondary">{value}</span>
    </div>
  );
}

function MoneyValue({ value }: { value: number | null }) {
  return value === null || value === undefined ? (
    "-"
  ) : (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {value}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span className="w-full break-all text-base font-medium text-secondary">
        {value || "-"}
      </span>
    </div>
  );
}

function RedemptionHeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-4 py-3">{children}</th>;
}

function RedemptionCell({
  children,
  dir,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td dir={dir} className="whitespace-nowrap border-b border-primary/15 px-4 py-3">
      {children}
    </td>
  );
}
