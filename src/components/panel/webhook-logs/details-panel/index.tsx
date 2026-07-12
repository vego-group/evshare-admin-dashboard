"use client";

import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { RotateCw } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useWebhookLog } from "@/hooks/api";
import { cn } from "@/lib/utils";
import { retryWebhookLogAPI } from "@/services/mutations";
import type { WebhookLog } from "@/types";

import { formatDate, formatGateway } from "../utils";
import { ProcessedBadge } from "../table/status-badges";

type WebhookLogDetailsPanelProps = {
  logId: string | null;
  open: boolean;
  onClose: () => void;
};

function WebhookLogDetailsPanel({
  logId,
  open,
  onClose,
}: WebhookLogDetailsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useWebhookLog(logId);
  const [isRetrying, setIsRetrying] = useState(false);
  const log = data?.data;

  if (!logId) return null;

  async function handleRetry() {
    if (!logId || isRetrying) return;

    const currentLogId = logId;
    setIsRetrying(true);
    const result = await retryWebhookLogAPI(currentLogId);
    setIsRetrying(false);

    if (result?.ok) {
      toast.success(result.message || "تمت إعادة إرسال السجل بنجاح");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["webhook-logs"] }),
        queryClient.invalidateQueries({
          queryKey: ["webhook-log", currentLogId],
        }),
      ]);
      return;
    }

    toast.error(result?.message || "فشلت إعادة إرسال السجل");
  }

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
      title="تفاصيل سجل الويب هوك"
      titleClassName="text-2xl font-medium leading-8 text-secondary"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <DetailsShimmer />
          ) : log ? (
            <WebhookLogDetails log={log} />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل تفاصيل السجل.
            </div>
          )}
        </div>

        {log ? (
          <PermissionGate slug="Admin Retry Webhook Logs">
            <footer className="shrink-0 border-t border-gray/20 px-6 pb-5 pt-6">
              <Button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className={cn(
                  "h-12 w-full rounded-[14px] bg-primary text-base font-medium leading-6 text-white hover:bg-primary/90",
                  isRetrying && "gap-2",
                )}
              >
                {isRetrying ? <Loader /> : <RotateCw className="size-5" />}
                إعادة إرسال الويب هوك
              </Button>
            </footer>
          </PermissionGate>
        ) : null}
      </div>
    </Panel>
  );
}

function WebhookLogDetails({ log }: { log: WebhookLog }) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <DetailRow label="معرف السجل" value={log.id} valueDir="ltr" />
        <DetailRow label="بوابة الدفع" value={formatGateway(log.payment_gateway)} />
        <DetailRow
          label="حالة المعالجة"
          value={<ProcessedBadge isProcessed={log.is_processed} />}
        />
        <DetailRow
          label="تاريخ الاستلام"
          value={formatDate(log.created_at)}
          valueDir="ltr"
        />
        <DetailRow
          label="آخر تحديث"
          value={formatDate(log.updated_at)}
          valueDir="ltr"
        />
      </section>

      <JsonBlock title="ترويسات الطلب" value={log.request_header} />
      <JsonBlock title="محتوى الطلب" value={log.request_body} />
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueDir,
}: {
  label: string;
  value: ReactNode;
  valueDir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={valueDir}
        className="min-w-0 break-all text-base font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function PanelSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-base font-semibold leading-6 text-secondary">
      {children}
    </h3>
  );
}

function JsonBlock({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown> | null;
}) {
  if (!value || !Object.keys(value).length) return null;

  return (
    <section className="space-y-4 rounded-[14px] bg-background p-5">
      <PanelSectionTitle>{title}</PanelSectionTitle>
      <pre
        dir="ltr"
        className="max-h-72 overflow-auto rounded-[10px] bg-white p-4 text-left text-xs leading-5 text-secondary"
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

function DetailsShimmer() {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"
          >
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-5 w-40" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default WebhookLogDetailsPanel;
