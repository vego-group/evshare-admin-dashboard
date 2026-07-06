"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PAGE_SIZE } from "@/constants";
import { useTrips } from "@/hooks/api";
import type { TripsQueryParams } from "@/types";

import TripsContentShimmer from "./content-shimmer";
import TripsHeader from "./header";
import TripsMainContent from "./trips-main-content";

function Trips() {
  const router = useRouter();
  const [params, setParams] = useState<TripsQueryParams>({ page: 1, limit: PAGE_SIZE });
  const { data, isLoading } = useTrips(params);

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <TripsContentShimmer />
      ) : (
        <>
          <TripsHeader />
          <TripsMainContent
            data={data}
            params={params}
            onParamsChange={(next) => setParams((current) => ({ ...current, ...next }))}
            onView={(trip) => router.push(`/trips/${trip.id}`)}
          />
        </>
      )}
    </div>
  );
}

export default Trips;
