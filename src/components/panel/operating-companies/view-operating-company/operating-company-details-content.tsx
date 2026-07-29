"use client";

import { ImageIcon, Percent } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { OperatingCompanyListItem } from "@/types";

import OperatingCompanyDetailsShimmer from "../modals/operating-company-details-shimmer";

type Props = {
  company?: OperatingCompanyListItem;
  isLoading: boolean;
};

export function OperatingCompanyDetailsContent({ company, isLoading }: Props) {
  if (isLoading) return <OperatingCompanyDetailsShimmer />;

  if (!company) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        تعذر تحميل تفاصيل الشركة.
      </div>
    );
  }

  const logoUrl = company.logo?.[0]?.url;

  return (
    <div className="flex min-w-0 flex-col gap-6 text-right">
      <div className="flex flex-col gap-4 rounded-[14px] bg-background p-4">
        {logoUrl ? (
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image src={logoUrl} alt={company.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-primary/15 text-secondary">
            <ImageIcon className="size-16" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="w-full break-all text-xl font-bold text-secondary">
            {company.name}
          </h3>
          <span className="inline-flex h-8.5 w-fit items-center gap-1 whitespace-nowrap rounded-full bg-primary/10 px-4 text-sm font-medium text-secondary">
            {company.commission_percentage ?? 0}
            <Percent className="size-3.5" />
          </span>
        </div>
      </div>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">البيانات الأساسية</h4>
        <DetailRow label="الاسم بالعربية" value={company.name_ar} />
        <DetailRow label="الاسم بالإنجليزية" value={company.name_en} />
        <DetailRow label="المعرف (Slug)" value={company.slug} />
        <DetailRow
          label="نسبة العمولة"
          value={
            <span className="inline-flex items-center gap-1" dir="ltr">
              {company.commission_percentage ?? 0}
              <Percent className="size-4 shrink-0" />
            </span>
          }
        />
        <DetailRow
          label="رقم الجوال"
          value={company.mobile ? formatSaudiPhoneNumber(company.mobile) : undefined}
        />
        <DetailRow label="البريد الإلكتروني" value={company.email} />
        <DetailRow label="تاريخ الإنشاء" value={formatDate(company.created_at)} />
      </section>

      {(company.conditions_ar || company.conditions_en) && (
        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <h4 className="text-sm font-semibold text-secondary">
            الشروط والأحكام
          </h4>
          <DetailRow label="بالعربية" value={company.conditions_ar} />
          <DetailRow label="بالإنجليزية" value={company.conditions_en} />
        </section>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: ReactNode | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span className="w-full break-all text-base font-medium text-secondary">
        {value || "-"}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
