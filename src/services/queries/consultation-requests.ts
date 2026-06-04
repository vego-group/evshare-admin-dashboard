import { PAGE_SIZE } from "@/constants";
import { baseAPI } from "..";
import { buildQuery } from "@/lib";
import type {
  ConsultationDetailResponse,
  ConsultationListResponse,
  ConsultationsQueryParams,
} from "@/types";

export const consultationsRequestsAPI = async (
  params: ConsultationsQueryParams,
): Promise<ConsultationListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/consultations?${query}`);
};

export const singleConsultationRequestAPI = async (
  consultationRequestId: string,
): Promise<ConsultationDetailResponse> => {
  return await baseAPI("GET", `/consultations/${consultationRequestId}`);
};
