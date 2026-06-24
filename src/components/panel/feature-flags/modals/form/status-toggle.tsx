import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
};

function FeatureFlagStatusToggle({ isActive, onChange }: Props) {
  return (
    <div className="sm:col-span-2">
      <span className="mb-2 block text-sm font-medium text-dark-gray">
        الحالة <span className="text-red-700">*</span>
      </span>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <Button
          type="button"
          role="switch"
          aria-checked={isActive}
          variant="ghost"
          onClick={() => onChange(!isActive)}
          className="h-auto w-full justify-between rounded-none bg-transparent p-0 hover:bg-transparent"
        >
          <span>{isActive ? "نشطة" : "غير نشطة"}</span>
          <span
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors after:block after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform",
              isActive
                ? "bg-green-500 after:-translate-x-5"
                : "bg-neutral-300 after:translate-x-0",
            )}
          />
        </Button>
      </div>
    </div>
  );
}

export default FeatureFlagStatusToggle;
