"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { useHasPermission } from "@/hooks";
import { useWebhookLogs } from "@/hooks/api";
import type { WebhookLogsQueryParams } from "@/types";

import WebhookLogsContentShimmer from "./content-shimmer";
import WebhookLogDetailsPanel from "./details-panel";
import WebhookLogsPagination from "./pagination";
import WebhookLogsTable from "./table";
import WebhookLogsToolbar from "./toolbar";

function WebhookLogs() {
  const [params, setParams] = useState<WebhookLogsQueryParams>({
    page: 1,
  });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const canShowDetails = useHasPermission("Admin Show Webhook Logs");

  const { data, isLoading, isFetching } = useWebhookLogs(params);

  const updateParams = (nextParams: Partial<WebhookLogsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === params.page) return;
    updateParams({ page });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <WebhookLogsContentShimmer />
      ) : (
        <>
          <Header
            title="سجلات الويب هوك"
            subtitle="تدقيق ومتابعة سجلات الويب هوك الواردة من بوابات الدفع"
          />
          <WebhookLogsToolbar
            gateway={params.gateway}
            isProcessed={params.is_processed}
            onGatewayChange={(gateway) => updateParams({ gateway, page: 1 })}
            onProcessedChange={(is_processed) =>
              updateParams({ is_processed, page: 1 })
            }
          />
          <WebhookLogsTable
            logs={data?.data ?? []}
            isFetching={isFetching}
            onLogSelect={canShowDetails ? setSelectedLogId : undefined}
          />
          <WebhookLogsPagination
            meta={data?.meta}
            currentPage={params.page}
            isFetching={isFetching}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <WebhookLogDetailsPanel
        logId={selectedLogId}
        open={Boolean(selectedLogId)}
        onClose={() => setSelectedLogId(null)}
      />
    </div>
  );
}

export default WebhookLogs;
