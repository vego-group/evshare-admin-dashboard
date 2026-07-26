"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { useSettings } from "@/hooks/api";
import type { Setting, SettingsQueryParams } from "@/types";

export function useSettingsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<SettingsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const { data, isLoading } = useSettings(params);
  const [pendingEdit, setPendingEdit] = useState<Setting | null>(null);

  async function refresh() {
    await queryClient.refetchQueries({ queryKey: ["settings"], type: "all" });
  }

  return {
    data,
    isLoading,
    params,
    setParams,
    pendingEdit,
    setPendingEdit,
    refresh,
  };
}
