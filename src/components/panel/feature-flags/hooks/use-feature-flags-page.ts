"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useFeatureFlags } from "@/hooks/api";
import { deleteFeatureFlag } from "@/services/mutations";
import type { FeatureFlag, FeatureFlagsQueryParams } from "@/types";

import { getFeatureFlagId } from "../utils";

export function useFeatureFlagsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<FeatureFlagsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingView, setPendingView] = useState<FeatureFlag | null>(null);
  const [pendingEdit, setPendingEdit] = useState<FeatureFlag | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FeatureFlag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isLoading } = useFeatureFlags(params);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParams((current) => {
        const search = searchValue.trim() || undefined;
        return current.search === search
          ? current
          : { ...current, page: 1, search };
      });
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  async function refresh(id?: string) {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ["feature-flags"], type: "all" }),
      ...(id
        ? [
            queryClient.refetchQueries({
              queryKey: ["feature-flag", id],
              type: "all",
            }),
          ]
        : []),
    ]);
  }

  async function handleDelete() {
    if (!pendingDelete || isDeleting) return;
    const id = getFeatureFlagId(pendingDelete);
    setIsDeleting(true);
    const result = await deleteFeatureFlag(id);
    setIsDeleting(false);

    if (!result?.ok) {
      toast.error(result?.message || "فشل حذف الميزة");
      return;
    }
    toast.success(result.message || "تم حذف الميزة بنجاح");
    setPendingDelete(null);
    await refresh(id);
  }

  return {
    data,
    isLoading,
    params,
    setParams,
    searchValue,
    setSearchValue,
    isAddOpen,
    setIsAddOpen,
    pendingView,
    setPendingView,
    pendingEdit,
    setPendingEdit,
    pendingDelete,
    setPendingDelete,
    isDeleting,
    refresh,
    handleDelete,
  };
}
