import { ProductsQueryParams } from "@/types";
import { useCustomQuery } from "..";
import { productsAPI, singleProductAPI } from "@/services/queries";

export function useProducts(params: ProductsQueryParams) {
  return useCustomQuery(["products", params], async () => productsAPI(params));
}

export function useProduct(productId: string | null) {
  return useCustomQuery(
    ["product", productId],
    async () => singleProductAPI(productId!),
    { enabled: Boolean(productId) },
  );
}
