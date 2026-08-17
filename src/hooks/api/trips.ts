import { keepPreviousData } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { singleTripAPI, tripsAPI } from "@/services/queries";
import type { TripsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useTrips(params: TripsQueryParams) {
  return useCustomQuery(["trips", params], async () => tripsAPI(params), {
    placeholderData: keepPreviousData,
  });
}

export function useTrip(tripId: string | null) {
  return useCustomQuery(
    ["trip", tripId],
    async () => singleTripAPI(tripId!),
    { enabled: Boolean(tripId) },
  );
}

const activeTripStatuses: TripsQueryParams["status"][] = ["started", "in_progress"];

export function useActiveTrips() {
  return useCustomQuery(
    ["trips", "active", activeTripStatuses],
    async () => {
      const responses = await Promise.all(
        activeTripStatuses.map((status) => tripsAPI({ page: 1, limit: PAGE_SIZE, status })),
      );
      return { ...responses[0], data: responses.flatMap((response) => response.data) };
    },
    {
      placeholderData: keepPreviousData,
      refetchInterval: 5000,
    },
  );
}
