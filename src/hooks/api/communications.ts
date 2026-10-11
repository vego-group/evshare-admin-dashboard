import { keepPreviousData } from "@tanstack/react-query";

import { communicationAPI, communicationRecipientsAPI, communicationsAPI } from "@/services/queries";
import type { CommunicationQueryParams, CommunicationRecipientsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useCommunications(params: CommunicationQueryParams) {
  return useCustomQuery(
    ["communications", params],
    () => communicationsAPI(params),
    { placeholderData: keepPreviousData },
  );
}

export function useCommunicationRecipients(
  params: CommunicationRecipientsQueryParams,
  enabled = true,
) {
  return useCustomQuery(
    ["communication-recipients", params],
    () => communicationRecipientsAPI(params),
    { enabled, placeholderData: keepPreviousData },
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
