"use client";

import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { toast } from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useIotWebhookLog } from "@/hooks/api";
import { retryIotWebhookLogAPI } from "@/services/mutations";
import type { IotWebhookJson, IotWebhookLog } from "@/types";

import { HandledBadge } from "./table";
import { formatIotWebhookDate, formatIotWebhookValue } from "./utils";

export default function IotWebhookLogDetailsPanel({ logId, open, onClose }: { logId: string | null; open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useIotWebhookLog(logId);
  const [isRetrying, setIsRetrying] = useState(false);
  const log = data?.data;
  if (!logId) return null;

  async function retry() {
    if (isRetrying) return;
    setIsRetrying(true);
    const result = await retryIotWebhookLogAPI(logId!);
    setIsRetrying(false);
    if (!result.ok) { toast.error(result.message || "فشلت إعادة معالجة السجل"); return; }
    toast.success(result.message || "تمت إعادة معالجة السجل بنجاح");
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["iot-webhook-logs"] }),
      queryClient.invalidateQueries({ queryKey: ["iot-webhook-log", logId] }),
    ]);
  }

  return (
    <Panel open={open} onClose={onClose} title="تفاصيل سجل ويب هوك إنترنت الأشياء" contentClassName="w-full gap-0 overflow-hidden bg-white p-0 sm:rounded-l-3xl" headerClassName="h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right" titleClassName="text-2xl font-medium text-secondary">
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? <DetailsShimmer /> : log ? <Details log={log} /> : <div className="grid min-h-80 place-items-center text-gray">تعذر تحميل تفاصيل السجل.</div>}
        </div>
        {log && <PermissionGate slug="Admin Retry IoT Webhook Logs"><footer className="border-t border-gray/20 px-6 py-5"><Button onClick={retry} disabled={isRetrying} className="h-12 w-full gap-2 rounded-[14px] bg-primary text-white hover:bg-primary/90">{isRetrying ? <Loader /> : <RotateCw className="size-5" />}إعادة معالجة السجل</Button></footer></PermissionGate>}
      </div>
    </Panel>
  );
}

function Details({ log }: { log: IotWebhookLog }) {
  return <div className="space-y-6">
    <section className="space-y-3 rounded-[14px] bg-background p-5">
      <Row label="معرف السجل" value={log.id} dir="ltr" />
      <Row label="معرف الجهاز" value={formatIotWebhookValue(log.device_id)} dir="ltr" />
      <Row label="نوع الحدث" value={formatIotWebhookValue(log.kind)} dir="ltr" />
      <Row label="المستأجر" value={formatIotWebhookValue(log.tenant)} dir="ltr" />
      <Row label="الحالة" value={<HandledBadge handled={log.handled} />} />
      {log.reason && <Row label="السبب" value={log.reason} />}
      <Row label="تاريخ الاستلام" value={formatIotWebhookDate(log.created_at)} dir="ltr" />
      <Row label="آخر تحديث" value={formatIotWebhookDate(log.updated_at)} dir="ltr" />
    </section>
    <JsonBlock title="البيانات الموحّدة" value={log.normalized} />
    <JsonBlock title="الحمولة الأصلية" value={log.payload} />
    <JsonBlock title="سياق الطلب" value={log.context} />
  </div>;
}

function Row({ label, value, dir }: { label: string; value: ReactNode; dir?: "ltr" | "rtl" }) {
  return <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"><span className="shrink-0 text-sm text-gray">{label}</span><span dir={dir} className="min-w-0 break-all font-medium text-secondary">{value}</span></div>;
}

function JsonBlock({ title, value }: { title: string; value: IotWebhookJson | null }) {
  if (!value || !Object.keys(value).length) return null;
  return <section className="space-y-3 rounded-[14px] bg-background p-5"><h3 className="font-semibold text-secondary">{title}</h3><pre dir="ltr" className="max-h-80 overflow-auto rounded-[10px] bg-white p-4 text-left text-xs leading-5 text-secondary">{JSON.stringify(value, null, 2)}</pre></section>;
}

function DetailsShimmer() {
  return <section className="space-y-3 rounded-[14px] bg-background p-5">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="flex justify-between rounded-[10px] bg-white px-4 py-3"><Shimmer className="h-4 w-24" /><Shimmer className="h-5 w-40" /></div>)}</section>;
}
