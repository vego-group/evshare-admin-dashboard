import { X } from "lucide-react";

function RejectOrderModalHeader({ productName }: { productName: string }) {
  return (
    <div dir="rtl" className="flex items-center gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-danger/15 text-danger">
        <X className="size-6" strokeWidth={2.5} />
      </span>

      <div className="text-right">
        <h2 className="text-xl font-medium leading-7 text-secondary">
          رفض الطلب
        </h2>
        <p className="text-sm leading-5 text-gray">{productName}</p>
      </div>
    </div>
  );
}

export default RejectOrderModalHeader;
