"use client";

import toast, { type ToastOptions } from "react-hot-toast";

export const DASHBOARD_SUCCESS_EVENT = "evshare:success";
export const DASHBOARD_CLOSE_MODALS_EVENT = "evshare:close-modals";

/**
 * Announces a completed dashboard action. Open action dialogs listen for this
 * event and close before the global success confirmation is displayed.
 */
export function showSuccessModal(
  message: string,
  options?: Pick<ToastOptions, "id">,
) {
  if (options?.id) toast.dismiss(options.id);

  // Close and unmount the active action dialog in a separate browser task
  // before mounting the success dialog. This prevents Radix exit animations
  // from leaving both panels visible at the same time.
  window.dispatchEvent(new Event(DASHBOARD_CLOSE_MODALS_EVENT));
  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent(DASHBOARD_SUCCESS_EVENT, { detail: message }),
    );
  }, 0);
}
