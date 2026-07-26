"use client";

import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/ui/header";
import { usePromo } from "@/hooks/api";

import { PromoDetailsContent } from "./promo-details-content";

function ViewPromo() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = usePromo(id ?? null);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5" />
        </button>
        <Header title="تفاصيل كود الخصم" subtitle="عرض بيانات وتحليلات كود الخصم المختار" />
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <PromoDetailsContent detail={data?.data} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ViewPromo;
