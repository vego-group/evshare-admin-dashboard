"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useContactUsSettings } from "@/hooks/api";
import type { ContactUsSetting } from "@/types";

export function useContactUsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useContactUsSettings();
  const [pendingEdit, setPendingEdit] = useState<ContactUsSetting | null>(null);

  async function refresh() {
    await queryClient.refetchQueries({
      queryKey: ["contact-us-settings"],
      type: "all",
    });
  }

  return {
    data,
    isLoading,
    pendingEdit,
    setPendingEdit,
    refresh,
  };
}
