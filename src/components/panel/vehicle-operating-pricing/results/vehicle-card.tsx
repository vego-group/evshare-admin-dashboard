import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import { vehicleTitle } from "../utils";
import VehicleActions from "./action-buttons";

type Props = {
  vehicle: VehicleListItem;
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onManageZone: (vehicle: VehicleListItem) => void;
  onControlPanel: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

function VehicleCard(props: Props) {
  const { vehicle } = props;
  const rows = [
    ["نوع التشغيل", vehicle.operating_type === "evshare" ? "EvShare" : "شركة تشغيل"],
    ["شركة التشغيل", vehicle.operation_company?.name ?? "-"],
    ["التاجر", vehicle.user?.name ?? (vehicle.user_id ? "تاجر محذوف" : "-")],
    ["البطارية", vehicle.battery_percentage != null ? `${vehicle.battery_percentage}%` : "-"],
    ["جهاز IoT", vehicle.iot_device_id ?? "-"],
    ["معرف القفل", vehicle.lock?.device_id ?? vehicle.lock_id ?? "-"],
    ["اتصال الجهاز", connectivityLabel(vehicle.lock?.connectivity)],
  ] as const;

  return (
    <article className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-primary/5 px-4 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-secondary">
            {vehicleTitle(vehicle)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
        <div className="shrink-0">
          <VehicleActions compact canUpdateCommission={Boolean(vehicle.operation_company)} onView={() => props.onView(vehicle)} onEdit={() => props.onEdit(vehicle)} onCommission={() => props.onCommission(vehicle)} onManageZone={() => props.onManageZone(vehicle)} onControlPanel={() => props.onControlPanel(vehicle)} onDelete={() => props.onDelete(vehicle)} />
        </div>
      </div>
      <div className="divide-y divide-primary/10 text-sm">
        {rows.map(([label, value]) => (
          <Line key={label} label={label} value={value} />
        ))}
      </div>
    </article>
  );
}

function connectivityLabel(connectivity?: "online" | "offline" | "unknown") {
  if (connectivity === "online") return "متصل";
  if (connectivity === "offline") return "غير متصل";
  return "غير معروف";
}

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="grid grid-cols-[38%_1fr] items-center gap-3 px-4 py-3"><span className="text-gray">{label}</span><span className="min-w-0 font-medium text-secondary">{value}</span></div>;
}

export default VehicleCard;
