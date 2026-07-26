import { singleTestAccountAPI, testAccountsAPI } from "@/services/queries";
import type { TestAccountsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useTestAccounts(params: TestAccountsQueryParams) {
  return useCustomQuery(["test-accounts", params], async () => testAccountsAPI(params));
}

export function useTestAccount(testAccountId: string | null) {
  return useCustomQuery(
    ["test-account", testAccountId],
    async () => singleTestAccountAPI(testAccountId!),
    { enabled: Boolean(testAccountId) },
  );
}
