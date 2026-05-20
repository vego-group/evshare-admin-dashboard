import { kycsAPI, singlekycAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import { KycsQueryParams } from "@/types";

export function useRegistrationRequests(params: KycsQueryParams) {
  return useCustomQuery(["registration-requests", params], async () =>
    kycsAPI(params),
  );
}

export function useRegistrationRequest(kycId: string | null) {
  return useCustomQuery(
    ["registration-request", kycId],
    async () => singlekycAPI(kycId!),
    { enabled: Boolean(kycId) },
  );
}
