import { keepPreviousData } from "@tanstack/react-query";

import { useCustomQuery } from "..";
import {
  dataCleanupHistoryAPI,
  dataCleanupModulesAPI,
  dataCleanupRunAPI,
} from "@/services/queries";
import type { DataCleanupStatus } from "@/types";

export function useDataCleanupModules() {
  return useCustomQuery(["data-cleanup-modules"], dataCleanupModulesAPI, {
    staleTime: 30_000,
  });
}

export function useDataCleanupHistory(params: {
  page?: number;
  per_page?: number;
  status?: DataCleanupStatus;
}) {
  return useCustomQuery(
    ["data-cleanup-history", params],
    () => dataCleanupHistoryAPI(params),
    { placeholderData: keepPreviousData },
  );
}

export function useDataCleanupRun(id: string | null, poll = false) {
  return useCustomQuery(
    ["data-cleanup-run", id],
    () => dataCleanupRunAPI(id!),
    {
      enabled: Boolean(id),
      refetchInterval: poll ? 3_000 : false,
    },
  );
}
