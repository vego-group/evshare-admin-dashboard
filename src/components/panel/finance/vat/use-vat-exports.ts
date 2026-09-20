"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useVatExportStatus } from "@/hooks/api";
import { requestVatExport } from "@/services/mutations";
import type { VatExport, VatExportRequest, VatExportResponse } from "@/types";
import { notifyForbidden } from "@/lib/toast-events";

const progressToastId = "vat-export-progress";

export const getVatExport = (response: VatExportResponse): VatExport =>
  "data" in response ? response.data : response;

async function downloadFile(id: string) {
  const response = await fetch(
    `/api/admin/finance/vat/exports/${encodeURIComponent(id)}/download`,
    {
      credentials: "same-origin",
    },
  );
  if (response.status === 403) notifyForbidden();
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : "تعذر تنزيل ملف التصدير";
    throw new Error(message);
  }

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download =
    response.headers.get("X-Export-Filename") || `vat-export-${id}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export function useVatExportActions(canExport: boolean) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const statusQuery = useVatExportStatus(activeId, canExport);

  useEffect(() => {
    if (!activeId) return;
    if (statusQuery.isError) {
      toast.error(
        statusQuery.error instanceof Error
          ? statusQuery.error.message
          : "تعذر متابعة التصدير",
        {
          id: progressToastId,
        },
      );
      setActiveId(null);
      return;
    }

    if (!statusQuery.data) return;
    const vatExport = getVatExport(statusQuery.data);

    if (vatExport.status === "queued" || vatExport.status === "processing") {
      const progress =
        vatExport.progress == null
          ? ""
          : ` (${Math.round(vatExport.progress)}%)`;
      toast.loading(`جارٍ تجهيز ملف التصدير${progress}`, {
        id: progressToastId,
      });
      return;
    }

    setActiveId(null);
    void queryClient.invalidateQueries({ queryKey: ["vat-exports"] });

    if (vatExport.status === "completed" && vatExport.download_url) {
      toast.loading("جارٍ تنزيل ملف التصدير", { id: progressToastId });
      void downloadFile(vatExport.id)
        .then(() =>
          toast.success("تم تنزيل ملف التصدير", { id: progressToastId }),
        )
        .catch((error) =>
          toast.error(
            error instanceof Error ? error.message : "تعذر تنزيل ملف التصدير",
            { id: progressToastId },
          ),
        );
    } else {
      toast.error(vatExport.error || "تعذر إكمال التصدير. حاول مرة أخرى.", {
        id: progressToastId,
      });
    }
  }, [
    activeId,
    queryClient,
    statusQuery.data,
    statusQuery.error,
    statusQuery.isError,
  ]);

  useEffect(() => () => toast.dismiss(progressToastId), []);

  const startExport = useCallback(
    async (payload: VatExportRequest) => {
      if (!canExport || isRequesting || activeId) return;
      setIsRequesting(true);
      toast.loading("جارٍ طلب ملف التصدير", { id: progressToastId });
      try {
        const result = await requestVatExport(payload);
        if (!result.ok || !result.data) {
          toast.error(result.message || "تعذر طلب ملف التصدير", {
            id: progressToastId,
          });
          return;
        }
        const vatExport = getVatExport(result.data);
        if (!vatExport.id) {
          toast.error("استجابة التصدير غير مكتملة", { id: progressToastId });
          return;
        }
        setActiveId(vatExport.id);
        void queryClient.invalidateQueries({ queryKey: ["vat-exports"] });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "تعذر طلب ملف التصدير",
          {
            id: progressToastId,
          },
        );
      } finally {
        setIsRequesting(false);
      }
    },
    [activeId, canExport, isRequesting, queryClient],
  );

  const downloadExport = useCallback(
    async (id: string) => {
      if (!canExport || downloadingId) return;
      setDownloadingId(id);
      try {
        await downloadFile(id);
        toast.success("تم تنزيل ملف التصدير");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "تعذر تنزيل الملف",
        );
      } finally {
        setDownloadingId(null);
      }
    },
    [canExport, downloadingId],
  );

  return {
    startExport,
    downloadExport,
    isBusy: isRequesting || Boolean(activeId),
    downloadingId,
  };
}
