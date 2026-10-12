"use client";

import toast, { type ToastOptions } from "react-hot-toast";

export const DASHBOARD_SUCCESS_EVENT = "evshare:success";

/**
 * Announces a completed dashboard action. Open action dialogs listen for this
 * event and close before the global success confirmation is displayed.
 */
export function showSuccessModal(
  message: string,
  options?: Pick<ToastOptions, "id">,
) {
  if (options?.id) toast.dismiss(options.id);
  window.dispatchEvent(
    new CustomEvent(DASHBOARD_SUCCESS_EVENT, { detail: message }),
  );
}
