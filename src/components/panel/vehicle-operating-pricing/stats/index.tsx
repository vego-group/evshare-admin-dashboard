import {
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  Route,
  Wrench,
} from "lucide-react";

import type { VehicleListItem } from "@/types";
import { getVehicleAnalytics } from "../utils";

function VehicleStats({ vehicles, total }: { vehicles?: VehicleListItem[]; total?: number }) {
  const stats = getVehicleAnalytics(vehicles);
  const cards = [
    ["الإجمالي", total ?? stats.total, ListChecks, "bg-primary/15 text-secondary"],
    ["نشط", stats.active, CheckCircle2, "bg-green-50 text-green-600"],
    ["قيد الاستخدام", stats.inUse, Route, "bg-indigo-50 text-indigo-600"],
    ["صيانة", stats.maintenance, Wrench, "bg-yellow-50 text-yellow-700"],
    ["موقوف", stats.suspended, AlertTriangle, "bg-red-50 text-red-600"],
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value, Icon, className]) => (
        <div key={label} className="flex items-center justify-between rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5">
          <div>
            <p className="text-sm text-gray">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-secondary">{value}</p>
          </div>
          <span className={`grid size-12 place-items-center rounded-[10px] ${className}`}>
            <Icon className="size-5" />
          </span>
        </div>
      ))}
    </section>
  );
}

export default VehicleStats;
