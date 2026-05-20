"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useProducts, useProduct } from "@/hooks/api";
import { deleteProduct } from "@/services/mutations";
import type { ProductListItem, ProductsQueryParams } from "@/types";

import ProductsMainContent from "./products-main-content";
import ProductsContentShimmer from "./content-shimmer";
import ProductsHeader, { type ProductsViewMode } from "./header";
import {
  ProductAddModal,
  ProductDeleteConfirmModal,
  ProductDetailsModal,
  ProductEditModal,
} from "./modals";

function Products() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ProductsViewMode>("table");
  const [params, setParams] = useState<ProductsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productPendingView, setProductPendingView] =
    useState<ProductListItem | null>(null);
  const [productPendingEdit, setProductPendingEdit] =
    useState<ProductListItem | null>(null);
  const [productPendingDelete, setProductPendingDelete] =
    useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useProducts(params);
  const { data: editProductData, isLoading: isEditProductLoading } =
    useProduct(productPendingEdit?.id ?? null);

  const updateParams = (nextParams: Partial<ProductsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  async function refreshProductQueries(productId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["products"] });

    if (productId) {
      await queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });
    }
  }

  async function handleDeleteProduct() {
    if (!productPendingDelete || isDeleting) {
      return;
    }

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
            onAddProduct={() => setIsAddModalOpen(true)}
          />
          <ProductsMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onViewProduct={setProductPendingView}
            onEditProduct={setProductPendingEdit}
            onDeleteProduct={setProductPendingDelete}
          />
        </>
      )}

      <ProductDetailsModal
        productId={productPendingView?.id ?? null}
        open={Boolean(productPendingView)}
        onClose={() => setProductPendingView(null)}
      />

      <ProductAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => refreshProductQueries()}
      />

      <ProductEditModal
        key={productPendingEdit?.id ?? "edit-product"}
        open={Boolean(productPendingEdit)}
        product={editProductData?.data}
        isLoading={isEditProductLoading}
        onClose={() => setProductPendingEdit(null)}
        onSaved={() => refreshProductQueries(productPendingEdit?.id)}
      />

      <ProductDeleteConfirmModal
        open={Boolean(productPendingDelete)}
        productName={productPendingDelete?.title}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setProductPendingDelete(null);
          }
        }}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}

export default Products;
