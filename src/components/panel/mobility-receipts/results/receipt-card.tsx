import type { ReactNode } from "react";

import type { MobilityReceipt } from "@/types";
import MobilityReceiptStatusBadge from "../status-badge";
import {
  formatLocation,
  formatMoney,
  formatOperatingType,
  formatReceiptDate,
  getReceiptAttachments,
  getTemplateStatus,
  receiptTitle,
} from "../utils";
import MobilityReceiptActions from "./action-buttons";
import AttachmentLink from "./attachment-link";

type Props = {
  receipt: MobilityReceipt;
  onView: (receipt: MobilityReceipt) => void;
  onEditTemplate: (receipt: MobilityReceipt) => void;
  onReview: (receipt: MobilityReceipt) => void;
};

function MobilityReceiptCard(props: Props) {
  const { receipt } = props;
  const attachments = getReceiptAttachments(receipt);
  const rows: Array<[string, ReactNode]> = [
    ["المستخدم", receipt.user_id ?? "-"],
    ["عنصر الطلب", receipt.order_item_id ?? "-"],
    ["نوع التشغيل", formatOperatingType(receipt.operating_type)],
    ["شركة التشغيل", receipt.operation_company?.name ?? "-"],
    ["الموقع", formatLocation(receipt)],
    ["سعر فتح القفل", formatMoney(receipt.open_price)],
    ["سعر الدقيقة", formatMoney(receipt.price_per_minute)],
    ["تاريخ الإنشاء", formatReceiptDate(receipt.created_at)],
    [
      "قالب العقد",
      attachments.length ? (
        <AttachmentLink attachment={attachments[0]} index={0} />
      ) : (
        <MobilityReceiptStatusBadge status={getTemplateStatus(receipt)} />
      ),
    ],
  ];

  return (
    <article className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-primary/5 px-4 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-secondary">
            {receiptTitle(receipt)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <MobilityReceiptStatusBadge status={receipt.status} />
            <MobilityReceiptStatusBadge status={receipt.activation_status} />
            <MobilityReceiptStatusBadge status={getTemplateStatus(receipt)} />
          </div>
        </div>
        <MobilityReceiptActions compact onView={() => props.onView(receipt)} onEditTemplate={() => props.onEditTemplate(receipt)} onReview={() => props.onReview(receipt)} />
      </div>
      <div className="divide-y divide-primary/10 text-sm">
        {rows.map(([label, value]) => (
          <Line key={label} label={label} value={value} />
        ))}
      </div>
    </article>
  );
}

function Line({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[38%_1fr] items-center gap-3 px-4 py-3">
      <span className="text-gray">{label}</span>
      <span className="min-w-0 font-medium text-secondary">{value}</span>
    </div>
  );
}

export default MobilityReceiptCard;
