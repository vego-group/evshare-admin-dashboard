"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

import Header from "@/components/ui/header";
import { useTrip } from "@/hooks/api";

import TripBasicInfo from "./trip-basic-info";
import TripBillingDetails from "./trip-billing-details";
import TripLocations from "./trip-locations";
import TripTimeline from "./trip-timeline";

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
      <Header title="تفاصيل الرحلة" subtitle="عرض بيانات الرحلة المختارة" />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        {isLoading || !trip ? (
          <p className="p-6 text-center text-sm text-gray">
            {isLoading ? "جارٍ التحميل..." : "تعذر العثور على الرحلة"}
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
