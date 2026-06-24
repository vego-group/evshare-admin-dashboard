import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FeatureFlagActionButton({
  label,
  danger,
  onClick,
  children,
}: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-neutral-50",
        danger && "text-red-600 hover:bg-red-50",
      )}
    >
      {children}
    </Button>
  );
}

export default FeatureFlagActionButton;
