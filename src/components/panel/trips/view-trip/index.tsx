"use client";

import { useParams } from "next/navigation";

import Header from "@/components/ui/header";
import { useTrip } from "@/hooks/api";

import TripBasicInfo from "./trip-basic-info";
import TripLocations from "./trip-locations";
import TripTimeline from "./trip-timeline";

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
            <TripLocations trip={trip} />
            <TripTimeline timeline={trip.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTrip;
