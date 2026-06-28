import type { MobilityReceipt } from "@/types";
import AttachmentLink from "../results/attachment-link";
import MobilityReceiptStatusBadge from "../status-badge";
import { getReceiptAttachments, getTemplateStatus, receiptTitle } from "../utils";

export function DetailsSummary({ receipt }: { receipt: MobilityReceipt }) {
  return (
    <section className="rounded-[18px] border border-primary/20 bg-primary/8 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray">المركبة</p>
          <h3 className="mt-1 break-words text-xl font-semibold text-secondary">
            {receiptTitle(receipt)}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <MobilityReceiptStatusBadge status={receipt.status} />
          <MobilityReceiptStatusBadge status={receipt.activation_status} />
          <MobilityReceiptStatusBadge status={getTemplateStatus(receipt)} />
        </div>
      </div>
    </section>
  );
}

export function InfoSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, React.ReactNode]>;
}) {
  return (
    <section className="rounded-[18px] border border-neutral-100 bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold text-secondary">{title}</h4>
      <div className="divide-y divide-primary/10">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

export function TemplateFiles({ receipt }: { receipt: MobilityReceipt }) {
  const attachments = getReceiptAttachments(receipt);
  return (
    <section className="rounded-[18px] border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-secondary">قالب العقد</h4>
        <MobilityReceiptStatusBadge status={getTemplateStatus(receipt)} />
      </div>
      {attachments.length ? (
        <div className="flex flex-col gap-2">
          {attachments.map((attachment, index) => (
            <AttachmentLink key={index} attachment={attachment} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray">لا يوجد قالب مرفوع.</p>
      )}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[130px_1fr] sm:gap-4">
      <p className="text-xs font-medium text-gray">{label}</p>
      <div className="min-w-0 break-words text-sm font-semibold text-secondary">
        {value}
      </div>
    </div>
  );
}
