import { keepPreviousData } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { singleTripAPI, tripsAPI } from "@/services/queries";
import type { TripListItem, TripsQueryParams, TripStatus } from "@/types";

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

const activeTripStatuses: TripStatus[] = ["started", "in_progress"];

async function activeTripsPage(status: TripStatus, page: number) {
  const response = await tripsAPI({
    page,
    limit: PAGE_SIZE,
    status,
    order_by: "desc",
  });

  if (response.error) {
    throw new Error(response.message || "Failed to load active trips");
  }

  return response;
}

async function allActiveTripsForStatus(
  status: TripStatus,
): Promise<TripListItem[]> {
  const firstPage = await activeTripsPage(status, 1);
  const lastPage = Math.max(1, firstPage.meta.lastPage);

  if (lastPage === 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      activeTripsPage(status, index + 2),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((response) => response.data);
}

export function useActiveTrips() {
  return useCustomQuery(
    ["trips", "active", activeTripStatuses],
    async () => {
      const tripsByStatus = await Promise.all(
        activeTripStatuses.map(allActiveTripsForStatus),
      );

      return Array.from(
        new Map(
          tripsByStatus.flat().map((trip) => [trip.id, trip]),
        ).values(),
      );
    },
    {
      placeholderData: keepPreviousData,
      refetchInterval: 5000,
    },
  );
}
