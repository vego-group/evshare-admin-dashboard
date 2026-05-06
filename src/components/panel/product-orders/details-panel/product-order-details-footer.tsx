import { CheckCircle, XCircle } from "lucide-react";

import type { ProductOrderStatus } from "@/types";

function ProductOrderDetailsFooter({
  onRejectClick,
  onStatusChange,
}: {
  onRejectClick: () => void;
  onStatusChange: (status: ProductOrderStatus) => void;
}) {
  return (
    <footer className="shrink-0 border-t border-border bg-white px-6 pb-5 pt-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onStatusChange("موافق عليه")}
          className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#00a63e] text-base font-medium leading-6 text-white shadow-sm transition hover:bg-green"
        >
          قبول الطلب
          <CheckCircle className="size-5" />
        </button>
        <button
          type="button"
          onClick={onRejectClick}
          className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-danger text-base font-medium leading-6 text-white shadow-sm transition hover:bg-red"
        >
          رفض الطلب
          <XCircle className="size-5" />
        </button>
      </div>
    </footer>
  );
}

export default ProductOrderDetailsFooter;
