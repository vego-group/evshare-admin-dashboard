import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  label: string;
  className: string;
  onClick: () => void;
};

function FeatureFlagActionButton({ icon: Icon, label, className, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
    </button>
  );
}

export default FeatureFlagActionButton;
