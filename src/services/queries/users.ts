import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  AdminUserDetailResponse,
  UsersListResponse,
  UsersQueryParams,
  UsersStatisticsResponse,
} from "@/types";

export const buildUsersQuery = (params: UsersQueryParams) => buildQuery({
    page: params.page.toString(),
    per_page: (params.per_page ?? params.limit ?? 10).toString(),
    role: params.role,
    status: params.status ?? params.account_status,
    verification_status: params.verification_status,
    subscription_status:
      params.role === "merchant" ? params.subscription_status : undefined,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? params.order_by,
    search: params.search,
  });

export const usersAPI = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  const query = buildUsersQuery(params);
  return await baseAPI("GET", `/users?${query}`);
};

export const usersStatisticsAPI = async (): Promise<UsersStatisticsResponse> =>
  await baseAPI("GET", "/users/statistics");

export const singleUserAPI = async (
  userId: string,
): Promise<AdminUserDetailResponse> => await baseAPI("GET", `/users/${userId}`);
