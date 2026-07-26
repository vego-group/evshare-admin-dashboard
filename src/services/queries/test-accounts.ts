import { buildQuery } from "@/lib/utils/build-query";
import type {
  TestAccountDetailResponse,
  TestAccountsListResponse,
  TestAccountsQueryParams,
} from "@/types";

import { baseAPI } from "..";

export const testAccountsAPI = async (
  params: TestAccountsQueryParams,
): Promise<TestAccountsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
  });

  return await baseAPI("GET", `/test-accounts?${query}`);
};

export const singleTestAccountAPI = async (
  testAccountId: string,
): Promise<TestAccountDetailResponse> =>
  await baseAPI("GET", `/test-accounts/${testAccountId}`);
