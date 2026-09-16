"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Header from "@/components/ui/header";
import { useTrip } from "@/hooks/api";

import TripBasicInfo from "./trip-basic-info";
import TripBillingDetails from "./trip-billing-details";
import TripLocations from "./trip-locations";
import TripTimeline from "./trip-timeline";
import TripDetailsShimmer from "./trip-details-shimmer";

const TripRouteMap = dynamic(() => import("./trip-route-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-primary/5" />,
});

function ViewTrip() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useTrip(id ?? null);
  const trip = data?.data;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/trips"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة إلى الرحلات"
        >
          <ArrowRight className="size-5" />
        </Link>
        <Header title="تفاصيل الرحلة" subtitle="عرض بيانات الرحلة المختارة" />
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        {isLoading ? (
          <TripDetailsShimmer />
        ) : !trip ? (
          <p className="p-6 text-center text-sm text-gray">
            تعذر العثور على الرحلة
          </p>
        ) : (
          <div className="space-y-5">
            <TripBasicInfo trip={trip} />
            <TripBillingDetails trip={trip} />
            <TripLocations trip={trip} />
            <section>
              <h3 className="mb-3 font-semibold text-secondary">مسار الرحلة</h3>
              <div className="h-80 w-full">
                <TripRouteMap trip={trip} />
              </div>
            </section>
            <TripTimeline timeline={trip.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTrip;
