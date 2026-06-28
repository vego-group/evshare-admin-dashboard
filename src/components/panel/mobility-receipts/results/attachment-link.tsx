import type { MobilityReceipt, MobilityReceiptFile } from "@/types";

type Attachment = NonNullable<
  MobilityReceipt["vehicle_contract"]
>["attachments"][number] | MobilityReceiptFile;

function AttachmentLink({ attachment, index }: { attachment: Attachment; index: number }) {
  const url = typeof attachment === "string" ? attachment : attachment.url;
  const label =
    typeof attachment === "string"
      ? `مرفق ${index + 1}`
      : "name" in attachment
        ? attachment.name || attachment.file_name || `مرفق ${index + 1}`
        : `قالب العقد ${index + 1}`;

  if (!url) return <span className="text-sm text-dark-gray">{label}</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-medium text-secondary underline"
    >
      {label}
    </a>
  );
}

export default AttachmentLink;
