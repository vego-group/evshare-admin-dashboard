import { X } from "lucide-react";

function RejectRequestModalHeader() {
  return (
    <div
      dir="rtl"
      className="flex h-12 w-full items-center gap-3 text-secondary"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-red/15 text-danger">
        <X className="size-6" strokeWidth={2.5} />
      </span>
      <h2 className="text-xl font-medium leading-7">رفض الطلب</h2>
    </div>
  );
}

export default RejectRequestModalHeader;
