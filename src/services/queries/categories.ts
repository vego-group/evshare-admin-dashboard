import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib";
import { baseAPI } from "..";
import {
  CategoriesListResponse,
  CategoryDetailResponse,
  QueryParams,
} from "@/types";

export const categoriesAPI = async (
  params: QueryParams,
): Promise<CategoriesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit ?? PAGE_SIZE).toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/categories?${query}`);
};

export const singleCategoryAPI = async (
  categoryId: string,
): Promise<CategoryDetailResponse> =>
  await baseAPI("GET", `/categories/${categoryId}`);
