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

const activeTripsParams: TripsQueryParams = { page: 1, limit: PAGE_SIZE, status: "started" };

export function useActiveTrips() {
  return useCustomQuery(["trips", activeTripsParams], async () => tripsAPI(activeTripsParams), {
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
  });
}
