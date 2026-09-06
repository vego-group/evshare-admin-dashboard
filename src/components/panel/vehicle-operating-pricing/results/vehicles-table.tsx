import type { ReactNode } from "react";

import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import { vehicleTitle } from "../utils";
import VehicleActions from "./action-buttons";

type Props = {
  vehicles: VehicleListItem[];
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onManageZone: (vehicle: VehicleListItem) => void;
  onControlPanel: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

const headers = [
  "المركبة",
  "الحالة",
  "شركة التشغيل",
  `جهاز \u2066IoT\u2069 / القفل`,
  "الاتصال",
  "الإجراءات",
];

function VehiclesTable(props: Props) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-260 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              {headers.map((h) => (
                <HeaderCell key={h}>{h}</HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="text-dark-gray">
                <TableCell>
                  <VehicleName vehicle={vehicle} />
                </TableCell>
                <TableCell truncate={false}>
                  <div className="flex flex-col items-start gap-1.5">
                    <StatusBadge status={vehicle.status} />
                    <RentalAvailabilityBadge vehicle={vehicle} />
                  </div>
                </TableCell>
                <TableCell>{vehicle.operation_company?.name ?? "-"}</TableCell>
                <TableCell truncate={false}>
                  <DeviceCell vehicle={vehicle} />
                </TableCell>
                <TableCell truncate={false}>
                  <ConnectivityBadge vehicle={vehicle} />
                </TableCell>
                <TableCell truncate={false}>
                  <VehicleActions
                    canUpdateCommission={Boolean(vehicle.operation_company)}
                    onView={() => props.onView(vehicle)}
                    onEdit={() => props.onEdit(vehicle)}
                    onCommission={() => props.onCommission(vehicle)}
                    onManageZone={() => props.onManageZone(vehicle)}
                    onControlPanel={() => props.onControlPanel(vehicle)}
                    onDelete={() => props.onDelete(vehicle)}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeviceCell({ vehicle }: { vehicle: VehicleListItem }) {
  return (
    <div dir="rtl" className="min-w-40 space-y-1 text-right text-xs">
      <p className="flex items-center gap-1.5">
        <span className="shrink-0 text-gray">جهاز IoT:</span>
        <bdi dir="ltr" className="truncate font-medium text-secondary">
          {vehicle.iot_device_id ?? "-"}
        </bdi>
      </p>
      <p className="flex items-center gap-1.5">
        <span className="shrink-0 text-gray">القفل:</span>
        <bdi dir="ltr" className="truncate font-medium text-secondary">
          {vehicle.lock?.device_id ?? vehicle.lock_id ?? "-"}
        </bdi>
      </p>
      {vehicle.lock && (
        <span className={`inline-flex rounded-full px-2 py-0.5 font-medium ${vehicle.lock.status === "locked" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {vehicle.lock.status === "locked" ? "القفل مقفل" : "القفل مفتوح"}
        </span>
      )}
    </div>
  );
}

function RentalAvailabilityBadge({ vehicle }: { vehicle: VehicleListItem }) {
  const availability = vehicle.rental_availability;
  if (!availability) return null;
  return (
    <span
      title={availability.reason ?? undefined}
      className={`max-w-36 truncate rounded-full px-2 py-0.5 text-[11px] font-medium ${availability.available ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-orange-600"}`}
    >
      {availability.message}
    </span>
  );
}

function ConnectivityBadge({ vehicle }: { vehicle: VehicleListItem }) {
  const connectivity = vehicle.lock?.connectivity ?? "unknown";
  const config = {
    online: { label: "متصل", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    offline: { label: "غير متصل", className: "bg-red-50 text-red-700", dot: "bg-red-500" },
    unknown: { label: "غير معروف", className: "bg-neutral-100 text-gray", dot: "bg-gray" },
  }[connectivity];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <span className={`size-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function VehicleName({ vehicle }: { vehicle: VehicleListItem }) {
  return (
    <p className="truncate font-medium text-secondary">
      {vehicleTitle(vehicle)}
    </p>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default VehiclesTable;
