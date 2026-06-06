import { buildQuery } from "@/lib";
import { baseAPI } from "..";
import { PAGE_SIZE } from "@/constants";
import type {
  AdminUserDetailResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/types";

export const usersAPI = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    role: params.role,
    order_by: params.order_by,
    search: params.search,
  });
  return await baseAPI("GET", `/users?${query}`);
};

export const singleUserAPI = async (
  userId: string,
): Promise<AdminUserDetailResponse> => await baseAPI("GET", `/users/${userId}`);
