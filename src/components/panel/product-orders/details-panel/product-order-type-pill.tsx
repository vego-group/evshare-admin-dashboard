import { cn } from "@/lib/utils";
import type { ProductOrderType } from "@/types";

const typeStyles: Record<ProductOrderType, string> = {
  "سكوتر كهربائي": "border-blue/20 bg-blue/10 text-blue",
  "دراجة كهربائية": "border-green/20 bg-green/10 text-green",
};

function ProductOrderTypePill({ type }: { type: ProductOrderType }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[30px] w-fit max-w-full items-center justify-center rounded-[10px] border px-3 text-center text-sm leading-5 whitespace-nowrap",
        typeStyles[type],
      )}
    >
      {type}
    </span>
  );
}

export default ProductOrderTypePill;
