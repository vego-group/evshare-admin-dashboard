"use client";

import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/ui/header";
import { useShipment } from "@/hooks/api";

import { ShipmentDetailsContent } from "./shipment-details-content";

function ViewShipment() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useShipment(id ?? null);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5 shrink-0" />
        </button>
        <Header
          title="تفاصيل الشحنة"
          subtitle="عرض بيانات الشحنة وسجل حالاتها"
        />
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <ShipmentDetailsContent shipment={data?.data} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ViewShipment;
