"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { useSettings, useSettingsPropagation } from "@/hooks/api";
import type { Setting, SettingsQueryParams } from "@/types";

export function useSettingsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<SettingsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const { data, isLoading } = useSettings(params);
  const propagation = useSettingsPropagation();
  const [pendingEdit, setPendingEdit] = useState<Setting | null>(null);

  async function refresh() {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ["settings"], type: "all" }),
      queryClient.refetchQueries({ queryKey: ["settings-propagation"], type: "all" }),
    ]);
  }

  return {
    data,
    isLoading,
    params,
    setParams,
    pendingEdit,
    setPendingEdit,
    refresh,
    propagation,
  };
}
