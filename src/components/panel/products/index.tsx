"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useProducts } from "@/hooks/api";
import { deleteProduct } from "@/services/mutations";
import type { ProductListItem, ProductsQueryParams } from "@/types";

import ProductsMainContent from "./products-main-content";
import ProductsContentShimmer from "./content-shimmer";
import ProductsHeader, { type ProductsViewMode } from "./header";
import { ProductDeleteConfirmModal } from "./modals";

function Products() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ProductsViewMode>("table");
  const [params, setParams] = useState<ProductsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [productPendingDelete, setProductPendingDelete] =
    useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useProducts(params);

  const updateParams = (nextParams: Partial<ProductsQueryParams>) => {
    setParams((currentParams) => ({ ...currentParams, ...nextParams }));
  };

  async function refreshProductQueries(productId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    if (productId) {
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }
  }

  async function handleDeleteProduct() {
    if (!productPendingDelete || isDeleting) return;

    const currentProduct = productPendingDelete;
    setIsDeleting(true);
    const result = await deleteProduct(currentProduct.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف المنتج بنجاح");
      setProductPendingDelete(null);
      await refreshProductQueries(currentProduct.id);
      return;
    }

    toast.error(result?.message || "فشل حذف المنتج");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ProductsContentShimmer />
      ) : (
        <>
          <ProductsHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddProduct={() => router.push("/products/add")}
          />
          <ProductsMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onViewProduct={(product) => router.push(`/products/${product.id}`)}
            onEditProduct={(product) => router.push(`/products/${product.id}/edit`)}
            onDeleteProduct={setProductPendingDelete}
          />
        </>
      )}

      <ProductDeleteConfirmModal
        open={Boolean(productPendingDelete)}
        productName={productPendingDelete?.title}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setProductPendingDelete(null);
        }}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}

export default Products;
