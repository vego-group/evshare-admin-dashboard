import { Button } from "@/components/ui/button";
import type { DashboardPeriod } from "@/types";

const periodOptions: { label: string; value: DashboardPeriod }[] = [
  { label: "7 أيام", value: 7 },
  { label: "14 يوم", value: 14 },
  { label: "30 يوم", value: 30 },
  { label: "90 يوم", value: 90 },
];

type RevenueOverviewControlsProps = {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
};

function RevenueOverviewControls({
  period,
  onPeriodChange,
}: RevenueOverviewControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-[11.5px] text-gray">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-3 rounded-full bg-primary" />
          الفترة الحالية
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-3 rounded-full border border-dashed border-gray/70 bg-gray/15" />
          الفترة السابقة
        </span>
      </div>

      <div className="inline-flex w-fit rounded-full bg-gray-100/70 p-1">
        {periodOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="xs"
            onClick={() => onPeriodChange(option.value)}
            className={
              option.value === period
                ? "rounded-full bg-white px-3 text-secondary shadow-sm hover:bg-white sm:px-4"
                : "rounded-full px-3 text-gray hover:bg-white/70 hover:text-secondary sm:px-4"
            }
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default RevenueOverviewControls;
