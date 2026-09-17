import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  AdminUserDetailResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/types";

export const usersAPI = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: params.limit.toString(),
    role: params.role,
    account_status: params.account_status,
    order_by: params.order_by,
    search: params.search,
  });
  return await baseAPI("GET", `/users?${query}`);
};

export const singleUserAPI = async (
  userId: string,
): Promise<AdminUserDetailResponse> => await baseAPI("GET", `/users/${userId}`);
