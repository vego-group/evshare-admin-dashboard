"use client";

import { useParams } from "next/navigation";

import Header from "@/components/ui/header";
import { useOperatingCompany } from "@/hooks/api";

import { OperatingCompanyDetailsContent } from "./operating-company-details-content";

function ViewOperatingCompany() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useOperatingCompany(id ?? null);

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="تفاصيل الشركة المشغلة" subtitle="عرض بيانات الشركة المختارة" />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <OperatingCompanyDetailsContent
          company={data?.data}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ViewOperatingCompany;
