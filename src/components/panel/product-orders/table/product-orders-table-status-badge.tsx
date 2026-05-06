import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { productOrderStatuses } from "@/data";
import { cn } from "@/lib/utils";
import type { ProductOrderStatus } from "@/types";

const statusStyles: Record<ProductOrderStatus, string> = {
  "موافق عليه": "bg-green/10 text-green",
  مرفوض: "bg-red/10 text-red",
  "قيد المراجعة": "bg-primary/10 text-[#d08700]",
};

function ProductOrdersTableStatusBadge({
  status,
  onChange,
}: {
  status: ProductOrderStatus;
  onChange: (status: ProductOrderStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-label="تغيير حالة الطلب"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "inline-flex h-[38px] min-w-[98px] items-center justify-center gap-2 rounded-full px-4 text-sm font-medium leading-5 transition hover:brightness-95",
          statusStyles[status],
        )}
      >
        <ChevronDown
          className={cn("size-4 transition", isOpen && "rotate-180")}
        />
        {status}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-max min-w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory text-right shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {productOrderStatuses.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-10 w-full items-center justify-start whitespace-nowrap px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                option === status && "bg-primary/15 text-secondary",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProductOrdersTableStatusBadge;
