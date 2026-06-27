import type { ReactNode } from "react";

import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import { formatPercentage, vehicleTitle } from "../utils";
import VehicleActions from "./action-buttons";

type Props = {
  vehicles: VehicleListItem[];
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onReview: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

function VehiclesTable(props: Props) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              {["المركبة", "الحالة", "التفعيل", "نوع التشغيل", "شركة التشغيل", "العمولة", "العقد", "الإجراءات"].map((h) => <HeaderCell key={h}>{h}</HeaderCell>)}
            </tr>
          </thead>
          <tbody>
            {props.vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="text-dark-gray">
                <TableCell><VehicleName vehicle={vehicle} /></TableCell>
                <TableCell><StatusBadge status={vehicle.status} /></TableCell>
                <TableCell><StatusBadge status={vehicle.activation_status} /></TableCell>
                <TableCell>{vehicle.operating_type === "evshare" ? "EvShare" : "شركة تشغيل"}</TableCell>
                <TableCell>{vehicle.operation_company?.name ?? "-"}</TableCell>
                <TableCell>{formatPercentage(vehicle.operation_company?.pricing_percentage ?? vehicle.operation_company?.commission_percentage)}</TableCell>
                <TableCell>{vehicle.vehicle_contract ? <StatusBadge status={vehicle.vehicle_contract.status} /> : "-"}</TableCell>
                <TableCell>
                  <VehicleActions canUpdateCommission={Boolean(vehicle.operation_company)} onView={() => props.onView(vehicle)} onEdit={() => props.onEdit(vehicle)} onReview={() => props.onReview(vehicle)} onCommission={() => props.onCommission(vehicle)} onDelete={() => props.onDelete(vehicle)} />
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
  return <p className="font-medium text-secondary">{vehicleTitle(vehicle)}</p>;
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({ children, dir }: { children: ReactNode; dir?: "ltr" | "rtl" }) {
  return <td dir={dir} className="border-b border-primary/15 px-5 py-3">{children}</td>;
}

export default VehiclesTable;
