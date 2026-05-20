import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

function PanelActionButton({
  icon: Icon,
  className,
  children,
  onClick,
  disabled,
  isLoading,
}: {
  icon: LucideIcon;
  className: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-base font-medium leading-6 text-white transition hover:brightness-95 disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
    >
      {isLoading ? <Loader /> : <Icon className="size-5" />}
      {children}
    </button>
  );
}

export default PanelActionButton;
