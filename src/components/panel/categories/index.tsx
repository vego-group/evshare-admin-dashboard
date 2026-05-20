"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useCategories, useCategory } from "@/hooks/api";
import { deleteCategory } from "@/services/mutations";
import type { CategoryListItem, QueryParams } from "@/types";

import CategoriesMainContent from "./categories-main-content";
import CategoriesContentShimmer from "./content-shimmer";
import CategoriesHeader, { type CategoriesViewMode } from "./header";
import {
  CategoryAddModal,
  CategoryDeleteConfirmModal,
  CategoryDetailsModal,
  CategoryEditModal,
} from "./modals";

function Categories() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<CategoriesViewMode>("table");
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryPendingView, setCategoryPendingView] =
    useState<CategoryListItem | null>(null);
  const [categoryPendingEdit, setCategoryPendingEdit] =
    useState<CategoryListItem | null>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<CategoryListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useCategories(params);
  const { data: editCategoryData, isLoading: isEditCategoryLoading } =
    useCategory(categoryPendingEdit?.id ?? null);

  const updateParams = (nextParams: Partial<QueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  async function refreshCategoryQueries(categoryId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });

    if (categoryId) {
      await queryClient.invalidateQueries({
        queryKey: ["category", categoryId],
      });
    }
  }

  async function handleDeleteCategory() {
    if (!categoryPendingDelete || isDeleting) {
      return;
    }

    const currentCategory = categoryPendingDelete;
    setIsDeleting(true);
    const result = await deleteCategory(currentCategory.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف التصنيف بنجاح");
      setCategoryPendingDelete(null);
      await refreshCategoryQueries(currentCategory.id);
      return;
    }

    toast.error(result?.message || "فشل حذف التصنيف");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <CategoriesContentShimmer />
      ) : (
        <>
          <CategoriesHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddCategory={() => setIsAddModalOpen(true)}
          />
          <CategoriesMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onViewCategory={setCategoryPendingView}
            onEditCategory={setCategoryPendingEdit}
            onDeleteCategory={setCategoryPendingDelete}
          />
        </>
      )}

      <CategoryDetailsModal
        categoryId={categoryPendingView?.id ?? null}
        open={Boolean(categoryPendingView)}
        onClose={() => setCategoryPendingView(null)}
      />

      <CategoryAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => refreshCategoryQueries()}
      />

      <CategoryEditModal
        key={categoryPendingEdit?.id ?? "edit-category"}
        open={Boolean(categoryPendingEdit)}
        category={editCategoryData?.data}
        isLoading={isEditCategoryLoading}
        onClose={() => setCategoryPendingEdit(null)}
        onSaved={() => refreshCategoryQueries(categoryPendingEdit?.id)}
      />

      <CategoryDeleteConfirmModal
        open={Boolean(categoryPendingDelete)}
        categoryName={categoryPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setCategoryPendingDelete(null);
          }
        }}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}

export default Categories;
