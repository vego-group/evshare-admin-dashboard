import { dashboardStats } from "@/data/dashboard";
import { DashboardSectionCard, TrendBadge } from "./dashboard-shared";

function StatCardsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <DashboardSectionCard
            key={stat.title}
            className="flex h-[172px] flex-col justify-center gap-4 rounded-[14px] border border-primary/8 px-6 py-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
          >
            <div>
              <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-neutral-100 text-gray">
                <Icon className="size-4.5" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 text-right">
              <p className="text-sm leading-5 font-medium text-gray">
                {stat.title}
              </p>

              <div className="flex justify-between gap-3">
                <p className="text-[30px] leading-[38px] font-semibold tracking-[-0.03em] text-dark-gray">
                  {stat.value}
                </p>
                <TrendBadge
                  value={stat.delta}
                  direction={stat.direction}
                  className="px-0 py-0 text-[14px] font-semibold shadow-none bg-transparent"
                />
              </div>

              <p className="text-xs leading-[18px] font-medium text-gray">
                {stat.comparison}
              </p>
            </div>
          </DashboardSectionCard>
        );
      })}
    </div>
  );
}

export default StatCardsSection;
