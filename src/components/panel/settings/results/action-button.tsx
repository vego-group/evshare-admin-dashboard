import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function SettingActionButton({ label, onClick, children }: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={cn("rounded-xl bg-neutral-50")}
    >
      {children}
    </Button>
  );
}

export default SettingActionButton;
