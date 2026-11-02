import { CircleAlert, CircleCheck, Link2Off, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VehicleListItem, VehicleLockConnectivity } from "@/types";
import StatusBadge from "./status-badge";

type Props = {
  vehicle: VehicleListItem;
  compact?: boolean;
};

const connectivityConfig: Record<
  VehicleLockConnectivity,
  { label: string; className: string; dot: string }
> = {
  online: {
    label: "متصل",
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  offline: {
    label: "غير متصل",
    className: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  unknown: {
    label: "غير معروف",
    className: "bg-neutral-100 text-dark-gray",
    dot: "bg-gray",
  },
};

export function VehicleOperationalStatus({ vehicle, compact = false }: Props) {
  const lock = vehicle.lock;
  const availability = vehicle.rental_availability;
  const connectivity = connectivityConfig[lock?.connectivity ?? "unknown"];

  return (
    <div
      className={cn(
        "grid gap-3",
        compact ? "grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4",
      )}
      aria-label="ملخص حالة المركبة والتأجير"
    >
      <StatusItem label="حالة المركبة">
        <StatusBadge status={vehicle.status} />
      </StatusItem>

      <StatusItem label="حالة القفل">
        {lock ? (
          <Badge
            className={
              lock.status === "locked"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }
          >
            {lock.status === "locked" ? "مقفل" : "مفتوح"}
          </Badge>
        ) : (
          <Badge className="bg-neutral-100 text-dark-gray">
            <Link2Off className="size-3.5" aria-hidden="true" />
            غير مربوط
          </Badge>
        )}
      </StatusItem>

      <StatusItem label="اتصال القفل">
        <Badge className={connectivity.className}>
          <span className={cn("size-2 rounded-full", connectivity.dot)} />
          {lock ? connectivity.label : "لا يوجد قفل"}
        </Badge>
      </StatusItem>

      <StatusItem label="توفر الإيجار">
        <Badge
          className={
            availability?.available
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-orange-700"
          }
          title={availability?.reason ?? undefined}
        >
          {availability?.available ? (
            <CircleCheck className="size-3.5" aria-hidden="true" />
          ) : (
            <CircleAlert className="size-3.5" aria-hidden="true" />
          )}
          {availability?.message || "غير متاح"}
        </Badge>
      </StatusItem>
    </div>
  );
}

function StatusItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-primary/10 bg-white p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray">
        <Radio className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      {children}
    </div>
  );
}

function Badge({
  className,
  title,
  children,
}: {
  className: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex min-h-8 max-w-full flex-wrap items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
