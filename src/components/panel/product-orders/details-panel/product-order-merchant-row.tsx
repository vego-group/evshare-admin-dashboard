import type { LucideIcon } from "lucide-react";

function ProductOrderMerchantRow({
  icon: Icon,
  label,
  value,
  valueDir,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueDir?: "rtl" | "ltr";
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-5 shrink-0 text-gray" />
      <div>
        <p className="text-sm leading-5 text-gray">{label}</p>
        <p className="text-base leading-6 text-secondary" dir={valueDir}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default ProductOrderMerchantRow;
