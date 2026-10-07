import { keepPreviousData } from "@tanstack/react-query";

import { communicationAPI, communicationsAPI } from "@/services/queries";
import type { CommunicationQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useCommunications(params: CommunicationQueryParams) {
  return useCustomQuery(
    ["communications", params],
    () => communicationsAPI(params),
    { placeholderData: keepPreviousData },
  );
}

export function useCommunication(id: string | null) {
  return useCustomQuery(
    ["communication", id],
    () => communicationAPI(id!),
    {
      enabled: Boolean(id),
      refetchInterval: (query) => {
        const status = query.state.data?.data.status;
        return status === "pending" || status === "processing" ? 3_000 : false;
      },
    },
  );
}
