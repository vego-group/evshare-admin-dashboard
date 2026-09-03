"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { useHasPermission } from "@/hooks";
import { useIotWebhookLogs } from "@/hooks/api";
import type { IotWebhookLogsQueryParams } from "@/types";

import IotWebhookLogsContentShimmer from "./content-shimmer";
import IotWebhookLogDetailsPanel from "./details-panel";
import IotWebhookLogsTable from "./table";
import IotWebhookLogsToolbar from "./toolbar";
import WebhookLogsPagination from "../webhook-logs/pagination";

export default function IotWebhookLogs() {
  const [params, setParams] = useState<IotWebhookLogsQueryParams>({ page: 1 });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const canShow = useHasPermission("Admin Show IoT Webhook Logs");
  const { data, isLoading, isFetching } = useIotWebhookLogs(params);
  const updateParams = (next: Partial<IotWebhookLogsQueryParams>) => setParams((current) => ({ ...current, ...next }));

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="سجلات ويب هوك إنترنت الأشياء" subtitle="تدقيق ومتابعة عمليات التسليم الواردة من بوابة Vego وإعادة معالجة السجلات عند الحاجة" />

      {isLoading ? (
        <IotWebhookLogsContentShimmer />
      ) : (
        <>
          <IotWebhookLogsToolbar params={params} onChange={updateParams} />
          <IotWebhookLogsTable logs={data?.data ?? []} isFetching={isFetching} onSelect={canShow ? setSelectedLogId : undefined} />
          <WebhookLogsPagination meta={data?.meta} currentPage={params.page} isFetching={isFetching} onPageChange={(page) => updateParams({ page })} />
        </>
      )}

      <IotWebhookLogDetailsPanel logId={selectedLogId} open={Boolean(selectedLogId)} onClose={() => setSelectedLogId(null)} />
    </div>
  );
}
