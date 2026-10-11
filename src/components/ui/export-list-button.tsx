"use client";

import { Download, LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useHasPermission } from "@/hooks";

import { Button } from "./button";

type ExportListButtonProps = {
  permission: string;
  path: string;
  query?: string;
  fallbackFileName: string;
};

function responseFileName(header: string | null, fallback: string) {
  if (!header) return fallback;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      // Fall through to the regular filename parameter.
    }
  }

  return header.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback;
}

async function errorMessage(response: Response) {
  try {
    const payload = await response.json() as { message?: unknown };
    return typeof payload.message === "string" ? payload.message : undefined;
  } catch {
    return undefined;
  }
}

export default function ExportListButton({
  permission,
  path,
  query,
  fallbackFileName,
}: ExportListButtonProps) {
  const canExport = useHasPermission(permission);
  const [isExporting, setIsExporting] = useState(false);

  if (!canExport) return null;

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 120_000);

    try {
      const suffix = query ? `?${query}` : "";
      const response = await fetch(`/api/admin/${path}/export${suffix}`, {
        headers: { Accept: "application/json", "app-language": "ar" },
        credentials: "same-origin",
        signal: controller.signal,
      });

      if (response.status === 401) {
        window.location.replace("/login?expired=1");
        return;
      }
      if (!response.ok) {
        throw new Error((await errorMessage(response)) || "تعذر تصدير القائمة");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = responseFileName(
        response.headers.get("Content-Disposition"),
        fallbackFileName,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);

      if (response.headers.get("X-Export-Rows") === "0") {
        toast("لا توجد سجلات مطابقة للفلاتر الحالية");
      } else {
        toast.success("تم تجهيز ملف التصدير");
      }
    } catch (error) {
      toast.error(
        error instanceof DOMException && error.name === "AbortError"
          ? "استغرق التصدير وقتاً أطول من المتوقع. حاول تضييق نطاق الفلاتر"
          : error instanceof Error
            ? error.message
            : "تعذر تصدير القائمة",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsExporting(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleExport} disabled={isExporting}>
      {isExporting ? <LoaderCircle className="animate-spin" /> : <Download />}
      {isExporting ? "جارٍ التصدير..." : "تصدير"}
    </Button>
  );
}
