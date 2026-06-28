"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { useMobilityReceipt, useMobilityReceipts } from "@/hooks/api";
import type { MobilityReceipt, MobilityReceiptQueryParams } from "@/types";
import MobilityReceiptsContentShimmer from "./content-shimmer";
import MobilityReceiptsHeader, { type MobilityReceiptsViewMode } from "./header";
import MobilityReceiptsMainContent from "./main-content";
import { ReceiptDetailsModal, ReviewReceiptModal, UploadTemplateModal } from "./modals";

function MobilityReceipts() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<MobilityReceiptsViewMode>("table");
  const [params, setParams] = useState<MobilityReceiptQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [activeReceipt, setActiveReceipt] = useState<MobilityReceipt | null>(null);
  const [modal, setModal] = useState<"details" | "template" | "review" | null>(null);
  const { data, isLoading } = useMobilityReceipts(params);
  const { data: receiptData } = useMobilityReceipt(
    activeReceipt && modal ? activeReceipt.id : null,
  );
  const selectedReceipt = receiptData?.data ?? activeReceipt;

  const updateParams = (nextParams: Partial<MobilityReceiptQueryParams>) => {
    setParams((currentParams) => ({ ...currentParams, ...nextParams }));
  };

  const openModal = (nextModal: NonNullable<typeof modal>) => (
    receipt: MobilityReceipt,
  ) => {
    setActiveReceipt(receipt);
    setModal(nextModal);
  };

  async function refreshReceiptQueries(receiptId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["mobility-receipts"] });
    if (receiptId) {
      await queryClient.invalidateQueries({ queryKey: ["mobility-receipt", receiptId] });
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <MobilityReceiptsContentShimmer />
      ) : (
        <>
          <MobilityReceiptsHeader viewMode={viewMode} onViewModeChange={setViewMode} />
          <MobilityReceiptsMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onView={openModal("details")}
            onEditTemplate={openModal("template")}
            onReview={openModal("review")}
          />
        </>
      )}
      <ReceiptDetailsModal open={modal === "details"} receipt={selectedReceipt} onClose={() => setModal(null)} />
      <UploadTemplateModal open={modal === "template"} receipt={selectedReceipt} onClose={() => setModal(null)} onSaved={() => refreshReceiptQueries(selectedReceipt?.id)} />
      <ReviewReceiptModal open={modal === "review"} receipt={selectedReceipt} onClose={() => setModal(null)} onSaved={() => refreshReceiptQueries(selectedReceipt?.id)} />
    </div>
  );
}

export default MobilityReceipts;
