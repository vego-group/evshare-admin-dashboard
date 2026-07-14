import { pagesAPI, singlePageAPI } from "@/services/queries";
import type { PagesQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function usePages(params: PagesQueryParams = {}) {
  return useCustomQuery(["pages", params], async () => pagesAPI(params));
}

export function usePage(uuid: string | null) {
  return useCustomQuery(["page", uuid], async () => singlePageAPI(uuid!), {
    enabled: Boolean(uuid),
  });
}
