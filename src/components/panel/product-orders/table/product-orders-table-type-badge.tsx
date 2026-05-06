import { cn } from "@/lib/utils";
import type { ProductOrderType } from "@/types";

const typeStyles: Record<ProductOrderType, string> = {
  "سكوتر كهربائي": "bg-blue/10 text-blue",
  "دراجة كهربائية": "bg-[#f8edff] text-[#a100ff]",
};

function ProductOrdersTableTypeBadge({ type }: { type: ProductOrderType }) {
  return (
    <span
      className={cn(
        "inline-flex h-[38px] min-w-[98px] items-center justify-center rounded-full px-4 text-sm font-medium leading-5",
        typeStyles[type],
      )}
    >
      {type}
    </span>
  );
}

export default ProductOrdersTableTypeBadge;
