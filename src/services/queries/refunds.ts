import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  Refund,
  RefundEligibility,
  RefundResponse,
  RefundsListResponse,
  RefundsQueryParams,
  RefundTransition,
  RefundableType,
} from "@/types";

export function unwrapRefund(response: RefundResponse): Refund {
  return "data" in response ? response.data : response;
}

export const refundsAPI = async (
  params: RefundsQueryParams = {},
): Promise<RefundsListResponse> => {
  const query = buildQuery(params);
  return await baseAPI("GET", `/refunds${query ? `?${query}` : ""}`);
};

export const refundEligibilityAPI = async (
  refundableType: RefundableType,
  refundableId: string,
): Promise<RefundEligibility> => {
  const query = buildQuery({
    refundable_type: refundableType,
    refundable_uuid: refundableId,
  });
  const response: RefundEligibility | { data: RefundEligibility } = await baseAPI(
    "GET",
    `/refunds/eligibility?${query}`,
  );
  return "data" in response ? response.data : response;
};

export const refundAPI = async (refundId: string): Promise<Refund> => {
  const response: RefundResponse = await baseAPI("GET", `/refunds/${refundId}`);
  return unwrapRefund(response);
};

export const refundTransitionsAPI = async (
  refundId: string,
): Promise<RefundTransition[]> => {
  const response: RefundTransition[] | { data: RefundTransition[] } = await baseAPI(
    "GET",
    `/refunds/${refundId}/transitions`,
  );
  return Array.isArray(response) ? response : response.data;
};
