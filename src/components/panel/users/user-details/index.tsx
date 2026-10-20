"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  Banknote,
  BellRing,
  CircleAlert,
  ExternalLink,
  type LucideIcon,
  MapPin,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import PermissionGate from "@/components/permission-gate";
import MoneyValue from "@/components/ui/money-value";
import { formatUserMobile } from "@/lib/utils/format-phone";
import { useTenantCountry } from "@/provider/currency";
import { useUser } from "@/hooks/api";
import type { AdminUserDetail } from "@/types";

import {
  AccountStatusBadge,
  formatDateTime,
  KycBadge,
  RoleBadge,
  UserIcon,
  VerifiedBadge,
} from "../results/user-result-parts";
import UserDetailsShimmer from "./user-details-shimmer";
import UserDetailActions from "./user-detail-actions";

const EMPTY_VALUE = "-";

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useUser(id ?? null);
  const user = data?.data;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5 shrink-0" />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <UserIcon className="hidden sm:grid" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold leading-8 text-secondary">
              {user?.name ?? "تفاصيل المستخدم"}
            </h1>
            {user ? (
              <p dir="ltr" className="text-right text-sm font-normal text-gray">
                {user.id}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {isLoading ? (
        <UserDetailsShimmer />
      ) : user ? (
        <><UserDetailActions user={user} /><UserDetailsContent user={user} /></>
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل المستخدم.
        </div>
      )}
    </div>
  );
}

function UserDetailsContent({ user }: { user: AdminUserDetail }) {
  const countryCode = useTenantCountry();
  const subscriptionSummary = user.subscription_summary;
  const isMerchant = user.role === "merchant";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={WalletCards}
          label="رصيد المحفظة"
          value={<MoneyValue value={user.wallet_balance} currency={user.wallet_currency ?? user.currency} />}
          dir="ltr"
        />
        <SummaryCard
          icon={ShieldCheck}
          label="التحقق"
          value={<KycBadge status={user.kyc_status} />}
        />
        {isMerchant ? (
          <SummaryCard
            icon={Banknote}
            label="حالة الاشتراك"
            value={
              <SubscriptionStatusBadge
                status={user.subscription_status}
                active={user.is_subscribed}
              />
            }
          />
        ) : null}
        <SummaryCard
          icon={UserRound}
          label="حالة الحساب"
          value={<AccountStatusBadge status={user.account_status} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="بيانات الحساب">
          <InfoRow label="الاسم" value={user.name || EMPTY_VALUE} />
          <InfoRow
            label="البريد الإلكتروني"
            value={user.email ?? EMPTY_VALUE}
            dir="ltr"
          />
          <InfoRow label="الجوال" value={formatUserMobile(user.mobile, countryCode, EMPTY_VALUE)} dir="ltr" align="left" />
          <InfoRow label="الدور" value={<RoleBadge role={user.role} />} />
          <InfoRow
            label="توثيق الجوال"
            value={<VerifiedBadge verified={user.mobile_verified} />}
          />
          <InfoRow
            label="تاريخ التوثيق"
            value={formatDateTime(user.mobile_verified_at)}
            dir="ltr"
          />
          <InfoRow
            label="تاريخ الإنشاء"
            value={formatDateTime(user.created_at)}
            dir="ltr"
          />
          {user.account_status === "deleted" ? (
            <InfoRow
              label="تاريخ إزالة الحساب"
              value={formatDateTime(user.deleted_at)}
              dir="ltr"
            />
          ) : null}
        </Section>

        <Section title="الموقع">
          <InfoRow label="المدينة" value={user.city?.name ?? EMPTY_VALUE} />
          <InfoRow
            label="خط العرض"
            value={
              user.location ? user.location.latitude.toString() : EMPTY_VALUE
            }
            dir="ltr"
          />
          <InfoRow
            label="خط الطول"
            value={
              user.location ? user.location.longitude.toString() : EMPTY_VALUE
            }
            dir="ltr"
          />
          <div className="flex items-center gap-2 rounded-[10px] bg-neutral-50 px-4 py-3 text-sm text-gray">
            <MapPin className="size-4 shrink-0" />
            <span>
              {user.location
                ? "المستخدم لديه موقع محفوظ"
                : "لم يتم حفظ موقع بعد"}
            </span>
          </div>
        </Section>

        <Section title="الحساب البنكي">
          <InfoRow
            label="البنك"
            value={user.bank_account?.bank_name ?? EMPTY_VALUE}
          />
          <InfoRow
            label="رقم الحساب"
            value={user.bank_account?.account_number ?? EMPTY_VALUE}
            dir="ltr"
          />
          <InfoRow
            label="IBAN"
            value={user.bank_account?.iban ?? EMPTY_VALUE}
            dir="ltr"
          />
        </Section>

        {isMerchant ? (
          <Section title="تفاصيل الاشتراك">
            <InfoRow
              label="حالة الاشتراك"
              value={<SubscriptionStatusBadge status={user.subscription_status} active={user.is_subscribed} />}
            />
            <InfoRow
              label="تاريخ بدء الاشتراك"
              value={formatDateTime(subscriptionSummary?.activated_at ?? user.subscription?.start_date ?? null)}
              dir="ltr"
            />
            <InfoRow
              label="تاريخ الانتهاء الأساسي"
              value={formatDateTime(subscriptionSummary?.base_ends_at ?? null)}
              dir="ltr"
            />
            <InfoRow
              label="تاريخ الانتهاء الحالي"
              value={formatDateTime(subscriptionSummary?.ends_at ?? user.subscription?.end_date ?? null)}
              dir="ltr"
            />
            {subscriptionSummary ? (
              <>
                <InfoRow
                  label="المدة الأساسية"
                  value={subscriptionSummary.initial_duration_months == null ? EMPTY_VALUE : `${formatNumber(subscriptionSummary.initial_duration_months)} شهر`}
                />
                <InfoRow label="أشهر المكافآت السارية" value={`${formatNumber(subscriptionSummary.bonus_months)} شهر`} />
                <InfoRow label="طلبات المكافآت السارية" value={formatNumber(subscriptionSummary.bonus_orders_count)} />
                <InfoRow label="المكافآت المسحوبة" value={formatNumber(subscriptionSummary.reversed_bonus_orders_count)} />
                <InfoRow label="مكافأة الطلب الواحد" value={`+${formatNumber(subscriptionSummary.bonus_months_per_order)} شهر`} />
                <InfoRow
                  label="الأيام المتبقية"
                  value={subscriptionSummary.days_remaining == null ? EMPTY_VALUE : formatNumber(subscriptionSummary.days_remaining)}
                />
                {!subscriptionSummary.is_bonus_enrolled ? (
                  <div className="flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                    <CircleAlert className="mt-1 size-4 shrink-0" />
                    <span>هذا اشتراك قديم غير مشمول بآلية المكافآت، ولن تكسب طلباته أشهراً إضافية حتى تتم تهيئته من الخادم.</span>
                  </div>
                ) : null}
              </>
            ) : null}
          </Section>
        ) : null}

        <Section title="الإحصائيات">
          <InfoRow
            label="العناوين"
            value={formatNumber(user.addresses_count)}
          />
          <InfoRow label="طلبات التحقق" value={formatNumber(user.kycs_count)} />
          <InfoRow
            label="الاشتراكات"
            value={formatNumber(user.subscriptions_count)}
          />
        </Section>

        <Section title="الإشعارات">
          <InfoRow
            label="إشعارات الدفع"
            value={
              <BooleanBadge
                active={user.notifications_enabled}
                activeLabel="مفعلة"
                inactiveLabel="متوقفة"
              />
            }
          />
          <div className="flex items-start gap-2 rounded-[10px] bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
            <BellRing className="mt-1 size-4 shrink-0" />
            <span>إيقاف الدفع لا يحذف الإشعارات؛ تظل الأحداث محفوظة في مركز الإشعارات داخل تطبيق المستخدم.</span>
          </div>
        </Section>
      </div>

      {isMerchant && user.subscription_extensions ? (
        <SubscriptionExtensions extensions={user.subscription_extensions} />
      ) : null}
    </div>
  );
}

function SubscriptionExtensions({ extensions }: { extensions: NonNullable<AdminUserDetail["subscription_extensions"]> }) {
  return (
    <section className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-secondary">سجل مكافآت الاشتراك</h2>
        <span className="text-sm text-gray">{formatNumber(extensions.length)} مكافأة</span>
      </div>
      {extensions.length === 0 ? (
        <p className="rounded-[10px] bg-neutral-50 px-4 py-6 text-center text-sm text-gray">لا توجد مكافآت اشتراك مسجلة.</p>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {extensions.map((extension) => (
            <article key={extension.id} className="space-y-3 rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray">الطلب</p>
                  {extension.order ? (
                    <PermissionGate
                      slug="Admin Show Orders"
                      fallback={<p dir="ltr" className="text-right font-semibold text-secondary">{extension.order.code}</p>}
                    >
                      <Link
                        href={`/orders/${encodeURIComponent(extension.order.id)}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {extension.order.code}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </Link>
                    </PermissionGate>
                  ) : (
                    <p className="font-semibold text-secondary">-</p>
                  )}
                </div>
                <span className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  extension.is_reversed ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700",
                )}>
                  {extension.is_reversed ? "مسحوبة" : `+${formatNumber(extension.months)} شهر`}
                </span>
              </div>
              <InfoRow label="حالة الطلب" value={extension.order?.status ?? EMPTY_VALUE} />
              <InfoRow label="معرّف الاشتراك" value={extension.subscription_id} dir="ltr" align="left" />
              <InfoRow label="تاريخ المنح" value={formatDateTime(extension.created_at)} dir="ltr" />
              <InfoRow
                label="تغيير الانتهاء عند المنح"
                value={<DateTransition from={extension.previous_ends_at} to={extension.new_ends_at} />}
              />
              {extension.reversal ? (
                <div className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-800">
                  <p className="font-medium">مسحوبة — {extension.reversal.reason === "refunded" ? "استرداد كامل" : "إلغاء الطلب"}</p>
                  <p className="mt-1">تاريخ السحب: <span dir="ltr">{formatDateTime(extension.reversal.created_at)}</span></p>
                  <div className="mt-1">
                    <DateTransition from={extension.reversal.previous_ends_at} to={extension.reversal.new_ends_at} />
                  </div>
                </div>
              ) : extension.is_reversed ? (
                <div className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-800">
                  <p className="font-medium">مسحوبة</p>
                  <p className="mt-1">تاريخ السحب: <span dir="ltr">{formatDateTime(extension.reversed_at)}</span></p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs leading-5 text-gray">
        تاريخ الانتهاء الحالي أعلاه هو المرجع المعتمد؛ تواريخ كل مكافأة لقطات تاريخية ولا يلزم أن تتسلسل بعد سحب مكافأة أقدم.
      </p>
    </section>
  );
}

function DateTransition({ from, to }: { from: string; to: string }) {
  return (
    <span dir="ltr" className="inline-flex flex-wrap items-center justify-end gap-1 text-left">
      <span>{formatDateTime(from)}</span>
      <span aria-hidden="true">→</span>
      <span>{formatDateTime(to)}</span>
    </span>
  );
}

function SubscriptionStatusBadge({
  status,
  active,
}: {
  status: AdminUserDetail["subscription_status"];
  active: boolean;
}) {
  const resolvedStatus = status ?? (active ? "active" : "unsubscribed");
  const labels = { active: "نشط", expired: "منتهي", unsubscribed: "غير مشترك" } as const;
  return (
    <span className={cn(
      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
      resolvedStatus === "active"
        ? "bg-green-50 text-green-700"
        : resolvedStatus === "expired"
          ? "bg-amber-50 text-amber-700"
          : "bg-gray-100 text-dark-gray",
    )}>
      {labels[resolvedStatus]}
    </span>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
        <Icon className="size-5 shrink-0" />
      </div>
      <div className="min-w-0 text-right">
        <p className="text-sm font-normal text-gray">{label}</p>
        <div
          dir={dir}
          className="mt-1 truncate text-base font-semibold text-secondary"
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <h2 className="mb-4 text-base font-semibold text-secondary">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  dir,
  align,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
  align?: "left" | "right";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-neutral-50 px-4 py-3">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className={cn(
          "min-w-0 wrap-break-word text-sm font-medium text-secondary",
          align === "left" ? "text-left" : "text-right",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function BooleanBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        active ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          active ? "bg-green-500" : "bg-gray-400",
        )}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}


function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-EG").format(value);
}

export default UserDetails;
