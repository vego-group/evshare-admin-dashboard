import { ConsultationsQueryParams } from "@/types";
import { useCustomQuery } from "..";
import {
  consultationsRequestsAPI,
  singleConsultationRequestAPI,
} from "@/services/queries";

export function useConsultationRequests(params: ConsultationsQueryParams) {
  return useCustomQuery(["consultations-requests", params], async () =>
    consultationsRequestsAPI(params),
  );
}

export function useConsultationRequest(consultationRequestId: string | null) {
  return useCustomQuery(
    ["consultation-request", consultationRequestId],
    async () => singleConsultationRequestAPI(consultationRequestId!),
    { enabled: Boolean(consultationRequestId) },
  );
}
