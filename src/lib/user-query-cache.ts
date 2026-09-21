import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type {
  AdminUserDetailResponse,
  UserListItem,
  UsersListResponse,
  UsersQueryParams,
} from "@/types";

/**
 * Applies the persisted user returned by an account mutation to every cached
 * user view. The follow-up invalidation remains important for filtered pages
 * because removing an item can pull a replacement in from the next page.
 */
export async function syncUserMutationResponse(
  queryClient: QueryClient,
  response: AdminUserDetailResponse,
) {
  const user = response.data;

  queryClient.setQueryData(["user", user.id], response);

  for (const [queryKey, cached] of queryClient.getQueriesData<UsersListResponse>({
    queryKey: ["users"],
  })) {
    if (!cached) continue;

    const existingIndex = cached.data.findIndex((item) => item.id === user.id);
    if (existingIndex === -1) continue;

    const params = getUsersQueryParams(queryKey);
    const stillMatchesStatus =
      !params?.account_status || params.account_status === user.account_status;

    if (!stillMatchesStatus) {
      queryClient.setQueryData<UsersListResponse>(queryKey, {
        ...cached,
        data: cached.data.filter((item) => item.id !== user.id),
        meta: {
          ...cached.meta,
          total: Math.max(0, cached.meta.total - 1),
        },
      });
      continue;
    }

    const nextData = [...cached.data];
    nextData[existingIndex] = { ...cached.data[existingIndex], ...toListItem(user) };
    queryClient.setQueryData<UsersListResponse>(queryKey, {
      ...cached,
      data: nextData,
    });
  }

  await queryClient.invalidateQueries({ queryKey: ["users"] });
}

function getUsersQueryParams(queryKey: QueryKey) {
  const params = queryKey[1];
  return params && typeof params === "object" ? (params as UsersQueryParams) : undefined;
}

function toListItem(user: UserListItem): UserListItem {
  return {
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    active: user.active,
    account_status: user.account_status,
    role: user.role,
    mobile_verified: user.mobile_verified,
    mobile_verified_at: user.mobile_verified_at,
    created_at: user.created_at,
  };
}
