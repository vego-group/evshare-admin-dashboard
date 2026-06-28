import type { MobilityReceipt } from "@/types";
import MobilityReceiptCard from "./receipt-card";

type Props = {
  receipts: MobilityReceipt[];
  onView: (receipt: MobilityReceipt) => void;
  onEditTemplate: (receipt: MobilityReceipt) => void;
  onReview: (receipt: MobilityReceipt) => void;
};

function MobilityReceiptsCards(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {props.receipts.map((receipt) => (
        <MobilityReceiptCard
          key={receipt.id}
          receipt={receipt}
          onView={props.onView}
          onEditTemplate={props.onEditTemplate}
          onReview={props.onReview}
        />
      ))}
    </div>
  );
}

export default MobilityReceiptsCards;
