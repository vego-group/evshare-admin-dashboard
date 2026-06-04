import type { UsersQueryParams } from "@/types";
import { useCustomQuery } from "..";
import { usersAPI } from "@/services/queries";

export function useUsers(params: UsersQueryParams) {
  return useCustomQuery(["users", params], async () => usersAPI(params));
}
