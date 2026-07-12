"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSettings } from "@/hooks/api";
import type { Setting } from "@/types";

export function useSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettings();
  const [pendingEdit, setPendingEdit] = useState<Setting | null>(null);

  async function refresh() {
    await queryClient.refetchQueries({ queryKey: ["settings"], type: "all" });
  }

  return {
    data,
    isLoading,
    pendingEdit,
    setPendingEdit,
    refresh,
  };
}
