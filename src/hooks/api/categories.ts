import { categoriesAPI, singleCategoryAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import { QueryParams } from "@/types";

export function useCategories(params: QueryParams) {
  return useCustomQuery(["categories", params], async () =>
    categoriesAPI(params),
  );
}

export function useCategory(categoryId: string | null) {
  return useCustomQuery(
    ["category", categoryId],
    async () => singleCategoryAPI(categoryId!),
    { enabled: Boolean(categoryId) },
  );
}
