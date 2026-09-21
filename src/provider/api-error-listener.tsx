"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { FORBIDDEN_EVENT } from "@/lib/toast-events";
import {
  API_ERROR_CODES,
  getApiErrorCode,
  getRequiredPermissions,
} from "@/lib/utils/api-error";

const forbiddenToastId = "api-forbidden";

export default function ApiErrorListener() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const showForbiddenMessage = (event: Event) => {
      const payload = event instanceof CustomEvent ? event.detail : undefined;
      const code = getApiErrorCode(payload);
      const required = getRequiredPermissions(payload);
      if (code === API_ERROR_CODES.permissionDenied) {
        void queryClient.invalidateQueries({ queryKey: ["auth-permissions"] });
      }
      const message =
        code === API_ERROR_CODES.accountSuspended
          ? "هذا الحساب موقوف. يرجى التواصل مع الدعم."
          : code === API_ERROR_CODES.tenantMismatch
            ? "الجلسة تخص دولة أخرى. سجّل الدخول من جديد للدولة المحددة."
            : code === API_ERROR_CODES.roleForbidden
              ? "هذا الحساب غير مصرح له باستخدام لوحة التحكم."
              : required.length > 0
                ? `ليس لديك الصلاحية المطلوبة: ${required.join("، ")}`
                : "ليس لديك الصلاحية المطلوبة لتنفيذ هذا الإجراء.";

      toast.error(message, { id: forbiddenToastId });

      if (
        code === API_ERROR_CODES.accountSuspended ||
        code === API_ERROR_CODES.tenantMismatch ||
        code === API_ERROR_CODES.roleForbidden
      ) {
        window.location.assign(`/access-denied?reason=${encodeURIComponent(code)}`);
      }
    };

    window.addEventListener(FORBIDDEN_EVENT, showForbiddenMessage);
    return () => window.removeEventListener(FORBIDDEN_EVENT, showForbiddenMessage);
  }, [queryClient]);

  return null;
}
