import type { UsersQueryParams } from "@/types";
import { useCustomQuery } from "..";
import { singleUserAPI, usersAPI } from "@/services/queries";

export function useUsers(params: UsersQueryParams) {
  return useCustomQuery(["users", params], async () => usersAPI(params));
}

export function useUser(userId: string | null) {
  return useCustomQuery(
    ["user", userId],
    async () => singleUserAPI(userId!),
    { enabled: Boolean(userId) },
  );
}
