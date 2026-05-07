import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PanelActionLinkProps {
  href: string;
  icon: LucideIcon;
  className: string;
  children: ReactNode;
}

function PanelActionLink({
  href,
  icon: Icon,
  className,
  children,
}: PanelActionLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-base font-medium leading-6 text-white transition",
        className,
      )}
    >
      <Icon className="size-5" />
      {children}
    </a>
  );
}

export default PanelActionLink;
