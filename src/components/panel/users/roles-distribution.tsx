import { Store, Truck, ShieldCheck, UsersRound } from "lucide-react";

import Shimmer from "@/components/ui/shimmer";
import type { UserRoleDistribution } from "@/types";

const palette = [
  {
    bar: "bg-violet-400",
    text: "text-violet-600",
    icon: "bg-violet-50 text-violet-600",
  },
  {
    bar: "bg-blue-400",
    text: "text-blue-600",
    icon: "bg-blue-50 text-blue-600",
  },
  {
    bar: "bg-emerald-400",
    text: "text-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
  },
  {
    bar: "bg-amber-400",
    text: "text-amber-600",
    icon: "bg-amber-50 text-amber-600",
  },
  {
    bar: "bg-rose-400",
    text: "text-rose-600",
    icon: "bg-rose-50 text-rose-600",
  },
];

function RoleIcon({ roleKey }: { roleKey: string }) {
  if (roleKey === "merchant") return <Store className="size-4" />;
  if (roleKey === "driver") return <Truck className="size-4" />;
  if (["admin", "root", "support"].includes(roleKey))
    return <ShieldCheck className="size-4" />;
  return <UsersRound className="size-4" />;
}

export default function RolesDistribution({
  roles,
  isLoading,
  isError,
}: {
  roles?: UserRoleDistribution[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
      <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <UsersRound className="size-5 text-slate-700" />
        <h2 className="font-semibold text-slate-900">
          توزيع المستخدمين حسب الدور
        </h2>
      </header>
      <div className="space-y-3 px-5 py-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Shimmer
                key={index}
                className="h-5 w-full rounded-full bg-slate-100"
              />
            ))
          : (roles ?? []).map((role, index) => {
              const color = palette[index % palette.length];
              const width = Math.max(0, Math.min(100, role.percentage));
              return (
                <div
                  key={role.id || role.key}
                  className="grid grid-cols-[minmax(5.5rem,auto)_1fr_auto] items-center gap-3 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg ${color.icon}`}
                    >
                      <RoleIcon roleKey={role.key} />
                    </span>
                    <span
                      className="truncate font-medium text-slate-700"
                      title={role.name}
                    >
                      {role.name}
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-slate-100"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full ${color.bar}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div
                    dir="ltr"
                    className="flex w-24 items-center justify-between gap-2 tabular-nums"
                  >
                    <span className={`font-semibold ${color.text}`}>
                      {role.percentage}%
                    </span>
                    <span className="text-slate-500">
                      {role.count.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              );
            })}
        {!isLoading && (isError || !roles) ? (
          <p className="py-3 text-center text-sm text-rose-700">
            تعذر تحميل توزيع الأدوار.
          </p>
        ) : !isLoading && roles?.length === 0 ? (
          <p className="py-3 text-center text-sm text-slate-500">
            لا توجد أدوار لعرضها.
          </p>
        ) : null}
      </div>
    </section>
  );
}
