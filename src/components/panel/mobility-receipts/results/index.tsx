import EmptyState from "@/components/ui/empty-state";
import type { MobilityReceipt } from "@/types";
import type { MobilityReceiptsViewMode } from "../header";
import MobilityReceiptsCards from "./receipts-cards";
import MobilityReceiptsTable from "./receipts-table";

type Props = {
  receipts: MobilityReceipt[];
  viewMode: MobilityReceiptsViewMode;
  onView: (receipt: MobilityReceipt) => void;
  onEditTemplate: (receipt: MobilityReceipt) => void;
  onReview: (receipt: MobilityReceipt) => void;
};

function MobilityReceiptsResults({
  receipts,
  viewMode,
  onView,
  onEditTemplate,
  onReview,
}: Props) {
  if (!receipts.length) {
    return (
      <EmptyState
        title="لا توجد سندات"
        description="لم يتم العثور على سندات استلام مطابقة."
      />
    );
  }

  const props = { receipts, onView, onEditTemplate, onReview };
  return viewMode === "table" ? (
    <MobilityReceiptsTable {...props} />
  ) : (
    <MobilityReceiptsCards {...props} />
  );
}

export default MobilityReceiptsResults;
