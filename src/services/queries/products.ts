import { PAGE_SIZE } from "@/constants";
import { baseAPI } from "..";
import { buildQuery } from "@/lib";
import {
  ProductDetailsResponse,
  ProductsListResponse,
  ProductsQueryParams,
} from "@/types";

export const productsAPI = async (
  params: ProductsQueryParams,
): Promise<ProductsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
    category_id: params.category_id?.toString(),
  });

  return await baseAPI("GET", `/products?${query}`);
};

export const singleProductAPI = async (
  productId: string,
): Promise<ProductDetailsResponse> =>
  await baseAPI("GET", `/products/${productId}`);
