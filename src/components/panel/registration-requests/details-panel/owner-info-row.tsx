import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function OwnerInfoRow({
  icon: Icon,
  label,
  value,
  valueDir,
  valueClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueDir?: "ltr" | "rtl";
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-5 shrink-0 text-gray" />
      <div className="min-w-0 text-right">
        <p className="text-sm font-normal leading-5 text-gray">{label}</p>
        <p
          dir={valueDir}
          className={cn(
            "mt-1 truncate text-base font-normal leading-6 text-secondary",
            valueClassName,
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default OwnerInfoRow;
