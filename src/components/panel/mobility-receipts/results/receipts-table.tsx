import type { ReactNode } from "react";

import type { MobilityReceipt } from "@/types";
import MobilityReceiptStatusBadge from "../status-badge";
import {
  formatOperatingType,
  formatReceiptDate,
  getReceiptAttachments,
  getTemplateStatus,
  receiptTitle,
} from "../utils";
import MobilityReceiptActions from "./action-buttons";
import AttachmentLink from "./attachment-link";

type Props = {
  receipts: MobilityReceipt[];
  onView: (receipt: MobilityReceipt) => void;
  onEditTemplate: (receipt: MobilityReceipt) => void;
  onReview: (receipt: MobilityReceipt) => void;
};

const headers = [
  "المركبة",
  "حالة التفعيل",
  "نوع التشغيل",
  "شركة التشغيل",
  "القالب",
  "تاريخ الإنشاء",
  "الإجراءات",
];

function MobilityReceiptsTable({ receipts, onView, onEditTemplate, onReview }: Props) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              {headers.map((header) => (
                <HeaderCell key={header}>{header}</HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="text-dark-gray">
                <Cell><p className="font-medium text-secondary">{receiptTitle(receipt)}</p></Cell>
                <Cell truncate={false}><MobilityReceiptStatusBadge status={receipt.activation_status} /></Cell>
                <Cell>{formatOperatingType(receipt.operating_type)}</Cell>
                <Cell>{receipt.operation_company?.name ?? "-"}</Cell>
                <Cell><Attachments receipt={receipt} /></Cell>
                <Cell>{formatReceiptDate(receipt.created_at)}</Cell>
                <Cell truncate={false}>
                  <MobilityReceiptActions compact onView={() => onView(receipt)} onEditTemplate={() => onEditTemplate(receipt)} onReview={() => onReview(receipt)} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Attachments({ receipt }: { receipt: MobilityReceipt }) {
  const attachments = getReceiptAttachments(receipt);
  if (!attachments.length) return <MobilityReceiptStatusBadge status={getTemplateStatus(receipt)} />;
  return (
    <div className="flex max-w-52 flex-col gap-1">
      {attachments.slice(0, 2).map((attachment, index) => (
        <AttachmentLink key={index} attachment={attachment} index={index} />
      ))}
    </div>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function Cell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default MobilityReceiptsTable;
