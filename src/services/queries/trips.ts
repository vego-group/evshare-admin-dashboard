import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type { TripDetailsResponse, TripsListResponse, TripsQueryParams } from "@/types";

import { baseAPI } from "..";

export const tripsAPI = async (
  params: TripsQueryParams,
): Promise<TripsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit || PAGE_SIZE).toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/trips?${query}`);
};

export const singleTripAPI = async (tripId: string): Promise<TripDetailsResponse> =>
  await baseAPI("GET", `/trips/${tripId}`);
