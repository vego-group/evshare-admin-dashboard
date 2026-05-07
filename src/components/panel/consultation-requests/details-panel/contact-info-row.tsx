import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TextDirection } from "@/lib/utils/format-phone";

interface ContactInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueDir?: TextDirection;
  valueClassName?: string;
}

function ContactInfoRow({
  icon: Icon,
  label,
  value,
  valueDir,
  valueClassName,
}: ContactInfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#f3f4f6] text-[#4a5565]">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-medium leading-6 text-[#6a7282]">
          {label}
        </p>
        <p
          dir={valueDir}
          className={cn(
            "mt-1 truncate text-base font-medium leading-6 text-[#101828]",
            valueClassName,
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default ContactInfoRow;
