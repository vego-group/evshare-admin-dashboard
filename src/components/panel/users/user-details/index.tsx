"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  Banknote,
  type LucideIcon,
  MapPin,
  SaudiRiyal,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import { useUser } from "@/hooks/api";
import type { AdminUserDetail } from "@/types";

import {
  formatDateTime,
  KycBadge,
  RoleBadge,
  UserIcon,
  VerifiedBadge,
} from "../results/user-result-parts";
import UserDetailsShimmer from "./user-details-shimmer";

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
          <ArrowRight className="size-5" />
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
        <UserDetailsContent user={user} />
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل المستخدم.
        </div>
      )}
    </div>
  );
}

function UserDetailsContent({ user }: { user: AdminUserDetail }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={WalletCards}
          label="رصيد المحفظة"
          value={<MoneyValue value={user.wallet_balance} />}
          dir="ltr"
        />
        <SummaryCard
          icon={ShieldCheck}
          label="التحقق"
          value={<KycBadge status={user.kyc_status} />}
        />
        <SummaryCard
          icon={Banknote}
          label="الاشتراك"
          value={
            <BooleanBadge
              active={user.is_subscribed}
              activeLabel="مشترك"
              inactiveLabel="غير مشترك"
            />
          }
        />
        <SummaryCard
          icon={UserRound}
          label="حالة الحساب"
          value={
            <BooleanBadge
              active={user.active}
              activeLabel="نشط"
              inactiveLabel="موقوف"
            />
          }
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
          <InfoRow label="الجوال" value={formatSaudiPhoneNumber(user.mobile)} dir="ltr" />
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
      </div>
    </div>
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
        <Icon className="size-5" />
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
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-neutral-50 px-4 py-3">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className="min-w-0 wrap-break-word text-right text-sm font-medium text-secondary"
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

function MoneyValue({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <SaudiRiyal className="size-4" />
      {formatMoneyNumber(value)}
    </span>
  );
}

function formatMoneyNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-EG").format(value);
}

export default UserDetails;
