import { BellRing, CheckCircle2, Power, Smartphone } from "lucide-react";
import type { ReactNode } from "react";

import type { AppVersionListItem } from "@/types";

type AppVersionsStatsProps = {
  appVersions: AppVersionListItem[];
};

function AppVersionsStats({ appVersions }: AppVersionsStatsProps) {
  const activeVersions = appVersions.filter(({ status }) => status === "active").length;
  const criticalVersions = appVersions.filter(({ is_critical }) => is_critical).length;
  const archivedVersions = appVersions.filter(
    ({ status }) => status === "archived",
  ).length;

  return (
    <section className="grid gap-4 md:grid-cols-4">
      <StatCard
        label="إجمالي الإصدارات"
        value={appVersions.length}
        icon={<Smartphone className="size-5" />}
      />
      <StatCard
        label="الإصدارات النشطة"
        value={activeVersions}
        icon={<CheckCircle2 className="size-5" />}
      />
      <StatCard
        label="التحديثات الحرجة"
        value={criticalVersions}
        icon={<BellRing className="size-5" />}
      />
      <StatCard
        label="الإصدارات المؤرشفة"
        value={archivedVersions}
        icon={<Power className="size-5" />}
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-primary/15 text-secondary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-gray">{label}</p>
        <p className="text-2xl font-semibold text-secondary">{value}</p>
      </div>
    </div>
  );
}

export default AppVersionsStats;
