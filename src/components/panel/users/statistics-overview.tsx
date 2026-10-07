import {
  Ban,
  ShieldAlert,
  UserPlus,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import Shimmer from "@/components/ui/shimmer";
import type { UsersStatisticsResponse } from "@/types";

type Statistics = UsersStatisticsResponse["data"]["statistics"];

const cards: Array<{
  key: keyof Statistics;
  label: string;
  helper: (statistics: Statistics) => string;
  icon: LucideIcon;
  accent: string;
  iconClass: string;
}> = [
  {
    key: "total_users",
    label: "إجمالي المستخدمين",
    helper: () => "جميع الحسابات",
    icon: UsersRound,
    accent: "from-blue-50/80",
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "active_users",
    label: "المستخدمون النشطون",
    helper: (s) => `${s.active_users.percentage}% من الإجمالي`,
    icon: UserRoundCheck,
    accent: "from-emerald-50/80",
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "suspended_users",
    label: "المستخدمون المعلقون",
    helper: (s) => `${s.suspended_users.percentage}% من الإجمالي`,
    icon: Ban,
    accent: "from-rose-50/80",
    iconClass: "bg-rose-50 text-rose-600",
  },
  {
    key: "unverified_users",
    label: "غير الموثقين",
    helper: () => "بحاجة للتحقق",
    icon: ShieldAlert,
    accent: "from-orange-50/80",
    iconClass: "bg-orange-50 text-orange-600",
  },
  {
    key: "new_users_this_month",
    label: "مستخدمون جدد",
    helper: () => "هذا الشهر",
    icon: UserPlus,
    accent: "from-violet-50/80",
    iconClass: "bg-violet-50 text-violet-600",
  },
];

export default function StatisticsOverview({
  statistics,
  isLoading,
  isError,
}: {
  statistics?: Statistics;
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (isError || (!isLoading && !statistics)) {
    return (
      <section className="rounded-2xl border border-rose-100 bg-rose-50/70 px-5 py-4 text-sm text-rose-700" role="status">
        تعذر تحميل ملخص المستخدمين. يمكنك متابعة إدارة المستخدمين والمحاولة مرة أخرى لاحقًا.
      </section>
    );
  }

  return (
    <section aria-label="ملخص المستخدمين" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ key, label, helper, icon: Icon, accent, iconClass }) => (
        <article
          key={key}
          className={`min-h-32 rounded-2xl border border-white bg-linear-to-bl ${accent} to-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.06)] ring-1 ring-slate-100`}
        >
          {isLoading || !statistics ? (
            <div className="space-y-4">
              <Shimmer className="size-11 rounded-xl bg-neutral-100" />
              <Shimmer className="h-7 w-20 rounded bg-neutral-100" />
            </div>
          ) : (
            <>
              <div className={`grid size-11 place-items-center rounded-xl ${iconClass}`}>
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-slate-800">{label}</h2>
                  <p className="mt-1 truncate text-xs text-slate-500">{helper(statistics)}</p>
                </div>
                <strong dir="ltr" className="shrink-0 text-2xl font-bold tracking-tight text-slate-950">
                  {statistics[key].count.toLocaleString("en-US")}
                </strong>
              </div>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
