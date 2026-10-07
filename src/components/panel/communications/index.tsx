"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import QueryErrorState from "@/components/ui/query-error-state";
import Shimmer from "@/components/ui/shimmer";
import { useHasPermission } from "@/hooks";
import { useCommunications } from "@/hooks/api";
import type { CommunicationQueryParams } from "@/types";

import CommunicationDetailsPanel from "./details-panel";
import CommunicationsHistory from "./history";
import SendCommunicationModal from "./send-modal";
import CommunicationsToolbar from "./toolbar";

export default function Communications() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<CommunicationQueryParams>({ page: 1, per_page: 10, sort_order: "desc" });
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canShowDetails = useHasPermission("Admin Show Communications");
  const query = useCommunications(params);

  const updateParams = (next: Partial<CommunicationQueryParams>) => setParams((current) => ({ ...current, ...next, page: next.page ?? 1 }));
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["communications"] });

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Header title="الرسائل التسويقية" subtitle="إرسال الإشعارات والرسائل النصية ومتابعة إحصاءات التسليم للتجار والسائقين" />
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="icon-lg" aria-label="تحديث السجل" title="تحديث السجل" onClick={() => void refresh()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? "animate-spin" : ""} /></Button>
          <PermissionGate slug="Admin Send Communications"><Button type="button" onClick={() => setSendOpen(true)} className="h-10 rounded-xl px-5"><Plus />رسالة جديدة</Button></PermissionGate>
        </div>
      </section>

      <CommunicationsToolbar search={params.search} status={params.status} channel={params.channel} targetApp={params.target_app} sortOrder={params.sort_order} onChange={updateParams} />

      {query.isLoading ? <HistoryShimmer /> : query.isError ? <QueryErrorState title="تعذر تحميل سجل الرسائل التسويقية" onRetry={() => void query.refetch()} isRetrying={query.isFetching} /> : (
        <CommunicationsHistory items={query.data?.data ?? []} meta={query.data?.meta} isFetching={query.isFetching} canShowDetails={canShowDetails} onSelect={setSelectedId} onPageChange={(page) => updateParams({ page })} />
      )}

      <SendCommunicationModal open={sendOpen} onClose={() => setSendOpen(false)} onSent={async (id) => { await refresh(); if (canShowDetails) setSelectedId(id); }} />
      <CommunicationDetailsPanel id={selectedId} open={Boolean(selectedId)} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function HistoryShimmer() { return <div className="space-y-3 rounded-2xl bg-white p-5">{Array.from({ length: 6 }).map((_, index) => <Shimmer key={index} className="h-14 w-full rounded-xl" />)}</div>; }
