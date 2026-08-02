"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { TOAST_SUCCESS_EVENT } from "@/lib/toast-events";

declare global {
  interface Window {
    __evshareToastSuccessPatched?: boolean;
  }
}

function ToastSuccessListener() {
  useEffect(() => {
    if (window.__evshareToastSuccessPatched) return;

    window.__evshareToastSuccessPatched = true;
    const originalSuccess = toast.success;

    toast.success = ((...args: Parameters<typeof toast.success>) => {
      const toastId = originalSuccess(...args);
      window.dispatchEvent(new Event(TOAST_SUCCESS_EVENT));
      return toastId;
    }) as typeof toast.success;
  }, []);

  return null;
}

export default ToastSuccessListener;
