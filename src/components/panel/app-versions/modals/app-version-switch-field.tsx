import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppVersionSwitchFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function AppVersionSwitchField({
  label,
  checked,
  onChange,
}: AppVersionSwitchFieldProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onChange(!checked)}
      className={cn(
        "h-14 justify-between rounded-[14px] border px-4 text-sm font-medium",
        checked
          ? "border-primary bg-primary/15 text-secondary"
          : "border-neutral-200 bg-neutral-50 text-dark-gray",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full border",
          checked
            ? "border-primary bg-primary text-secondary"
            : "border-neutral-300 bg-white",
        )}
      >
        {checked ? <Check className="size-4" /> : null}
      </span>
    </Button>
  );
}

export default AppVersionSwitchField;
