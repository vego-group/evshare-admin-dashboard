import { quickStats } from "@/data/dashboard";
import {
  DashboardSectionCard,
  Sparkline,
  TrendBadge,
} from "../shared";

function QuickStatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quickStats.map((item) => {
        return (
          <DashboardSectionCard key={item.title} className="p-6">
            <div className="flex flex-row-reverse items-start justify-between gap-2">
              <TrendBadge value={item.delta} direction={item.direction} />

              <div className="space-y-2 text-right">
                <p className="text-sm font-medium text-gray">{item.title}</p>
                <p className="text-2xl font-semibold leading-none tracking-[-0.02em] text-dark-gray">
                  {item.value}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0 grow">
                <Sparkline
                  data={item.chart}
                  color={item.lineColor}
                  className="h-12"
                />
              </div>
            </div>
          </DashboardSectionCard>
        );
      })}
    </div>
  );
}

export default QuickStatsSection;
