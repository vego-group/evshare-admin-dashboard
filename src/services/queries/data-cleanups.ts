import { buildQuery } from "@/lib/utils/build-query";
import type {
  DataCleanupHistoryResponse,
  DataCleanupModulesResponse,
  DataCleanupRunResponse,
  DataCleanupStatus,
} from "@/types";

import { baseAPI } from "..";

export const dataCleanupModulesAPI = async (): Promise<DataCleanupModulesResponse> =>
  await baseAPI("GET", "/data-cleanups/modules");

export const dataCleanupHistoryAPI = async (params: {
  page?: number;
  per_page?: number;
  status?: DataCleanupStatus;
} = {}): Promise<DataCleanupHistoryResponse> => {
  const query = buildQuery(params);
  return await baseAPI("GET", `/data-cleanups${query ? `?${query}` : ""}`);
};

export const dataCleanupRunAPI = async (id: string): Promise<DataCleanupRunResponse> =>
  await baseAPI("GET", `/data-cleanups/${encodeURIComponent(id)}`);
