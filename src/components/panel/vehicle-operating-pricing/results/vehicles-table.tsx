import type { ReactNode } from "react";

import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import {
  formatPercentage,
  getVehicleTemplateStatus,
  vehicleTitle,
} from "../utils";
import VehicleActions from "./action-buttons";

type Props = {
  vehicles: VehicleListItem[];
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onReview: (vehicle: VehicleListItem) => void;
  onReviewReceipt: (vehicle: VehicleListItem) => void;
  onEditTemplate: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onManageZone: (vehicle: VehicleListItem) => void;
  onControlPanel: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

const headers = [
  "المركبة",
  "الحالة",
  "التفعيل",
  "نوع التشغيل",
  "شركة التشغيل",
  "العمولة",
  "العقد",
  "قالب السند",
  "الإجراءات",
];

function VehiclesTable(props: Props) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-340 border-separate border-spacing-0 text-right">
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
                  <StatusBadge status={vehicle.status} />
                </TableCell>
                <TableCell truncate={false}>
                  <StatusBadge status={vehicle.activation_status} />
                </TableCell>
                <TableCell>
                  {vehicle.operating_type === "evshare"
                    ? "EvShare"
                    : "شركة تشغيل"}
                </TableCell>
                <TableCell>{vehicle.operation_company?.name ?? "-"}</TableCell>
                <TableCell>
                  {formatPercentage(
                    vehicle.operation_company?.pricing_percentage ??
                      vehicle.operation_company?.commission_percentage,
                  )}
                </TableCell>
                <TableCell truncate={false}>
                  {vehicle.vehicle_contract ? (
                    <StatusBadge status={vehicle.vehicle_contract.status} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell truncate={false}>
                  <StatusBadge status={getVehicleTemplateStatus(vehicle)} />
                </TableCell>
                <TableCell truncate={false}>
                  <VehicleActions
                    canUpdateCommission={Boolean(vehicle.operation_company)}
                    onView={() => props.onView(vehicle)}
                    onEdit={() => props.onEdit(vehicle)}
                    onReview={() => props.onReview(vehicle)}
                    onReviewReceipt={() => props.onReviewReceipt(vehicle)}
                    onEditTemplate={() => props.onEditTemplate(vehicle)}
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
