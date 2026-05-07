import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function PanelActionButton({
  icon: Icon,
  className,
  children,
  onClick,
}: {
  icon: LucideIcon;
  className: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-base font-medium leading-6 text-white transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-5" />
      {children}
    </button>
  );
}

export default PanelActionButton;
