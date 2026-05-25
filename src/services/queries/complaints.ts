import { PAGE_SIZE } from "@/constants";
import {
  ComplaintDetailResponse,
  ComplaintsListResponse,
  ComplaintsQueryParams,
} from "@/types";
import { baseAPI } from "..";
import { buildQuery } from "@/lib";

export const complaintsAPI = async (
  params: ComplaintsQueryParams,
): Promise<ComplaintsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
  });

  return await baseAPI("GET", `/complaints?${query}`);
};

export const singleComplaintAPI = async (
  complaintId: string,
): Promise<ComplaintDetailResponse> =>
  await baseAPI("GET", `/complaints/${complaintId}`);
