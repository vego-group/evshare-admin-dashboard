import FleetMapSection from "./fleet-map";
import OrderDistributionSection from "./order-distribution";
import QuickStatsSection from "./quick-stats";
import RevenueOverviewSection from "./revenue-overview";
import StatCardsSection from "./stat-cards";
import TopModelsSection from "./top-models";
import WeeklyRevenueSection from "./weekly-revenue";

function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-4">
      <StatCardsSection />
      <RevenueOverviewSection />
      <QuickStatsSection />
      <div className="grid gap-4 xl:grid-cols-2">
        <WeeklyRevenueSection />
        <OrderDistributionSection />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <TopModelsSection />
        <FleetMapSection />
      </div>
    </div>
  );
}

export default Dashboard;
