import { singleTestAccountAPI, testAccountsAPI } from "@/services/queries";
import type { TestAccountsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useTestAccounts(params: TestAccountsQueryParams, enabled = true) {
  return useCustomQuery(["test-accounts", params], async () => testAccountsAPI(params), {
    enabled,
  });
}

export function useTestAccount(testAccountId: string | null) {
  return useCustomQuery(
    ["test-account", testAccountId],
    async () => singleTestAccountAPI(testAccountId!),
    { enabled: Boolean(testAccountId) },
  );
}
