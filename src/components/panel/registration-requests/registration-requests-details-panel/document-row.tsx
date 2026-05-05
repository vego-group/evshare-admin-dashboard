import { CheckCircle, Download, FileText, XCircle } from "lucide-react";

function DocumentRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  const StatusIcon = complete ? CheckCircle : XCircle;

  return (
    <div className="flex h-12 items-center justify-between rounded-[10px] bg-white px-3 py-3">
      <div className="flex items-center gap-3 text-right">
        <FileText className="size-[18px] shrink-0 text-gray" />
        <span className="text-base font-normal leading-6 text-secondary">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIcon
          className={
            complete ? "size-[18px] text-green" : "size-[18px] text-red"
          }
        />
        <button
          type="button"
          aria-label={`تحميل ${label}`}
          className="grid size-5 place-items-center text-blue transition hover:brightness-90"
        >
          <Download className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default DocumentRow;
