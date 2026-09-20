"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { FORBIDDEN_EVENT } from "@/lib/toast-events";

const forbiddenToastId = "api-forbidden";

export default function ApiErrorListener() {
  useEffect(() => {
    const showForbiddenMessage = () => {
      toast.error("ليس لديك الصلاحية المطلوبة لتنفيذ هذا الإجراء.", {
        id: forbiddenToastId,
      });
    };

    window.addEventListener(FORBIDDEN_EVENT, showForbiddenMessage);
    return () => window.removeEventListener(FORBIDDEN_EVENT, showForbiddenMessage);
  }, []);

  return null;
}
