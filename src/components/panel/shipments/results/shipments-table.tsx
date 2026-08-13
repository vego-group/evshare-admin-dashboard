import type { ReactNode } from "react";

import type { ShipmentListItem } from "@/types";

import {
  DirectionBadge,
  ShipmentActions,
  ShipmentIcon,
  StatusBadge,
  formatDateOnly,
} from "./shipment-result-parts";

type ShipmentsTableProps = {
  shipments: ShipmentListItem[];
  onViewShipment: (shipment: ShipmentListItem) => void;
  onEditShipment: (shipment: ShipmentListItem) => void;
  onUpdateShipmentStatus: (shipment: ShipmentListItem) => void;
  onCancelShipment: (shipment: ShipmentListItem) => void;
  onDeleteShipment: (shipment: ShipmentListItem) => void;
};

function ShipmentsTable({
  shipments,
  onViewShipment,
  onEditShipment,
  onUpdateShipmentStatus,
  onCancelShipment,
  onDeleteShipment,
}: ShipmentsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>رقم التتبع</HeaderCell>
              <HeaderCell>الطلب</HeaderCell>
              <HeaderCell>المستلم</HeaderCell>
              <HeaderCell>شركة الشحن</HeaderCell>
              <HeaderCell>الاتجاه</HeaderCell>
              <HeaderCell>تاريخ التسليم المتوقع</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-60 items-center gap-3">
                    <ShipmentIcon />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium" dir="ltr">
                        {shipment.tracking_id ?? "—"}
                      </p>
                      <p className="truncate text-sm text-gray" dir="ltr">
                        {shipment.shipping_id ?? "—"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr">
                  {shipment.order?.order_code ?? "—"}
                </TableCell>
                <TableCell>{shipment.recipient?.name ?? "—"}</TableCell>
                <TableCell>{shipment.shipping_company?.name ?? "—"}</TableCell>
                <TableCell truncate={false}>
                  <DirectionBadge shipment={shipment} />
                </TableCell>
                <TableCell dir="ltr">
                  {formatDateOnly(shipment.estimated_delivery_date)}
                </TableCell>
                <TableCell truncate={false}>
                  <StatusBadge shipment={shipment} />
                </TableCell>
                <TableCell truncate={false}>
                  <ShipmentActions
                    shipment={shipment}
                    onView={() => onViewShipment(shipment)}
                    onEdit={() => onEditShipment(shipment)}
                    onUpdateStatus={() => onUpdateShipmentStatus(shipment)}
                    onCancel={() => onCancelShipment(shipment)}
                    onDelete={() => onDeleteShipment(shipment)}
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

export default ShipmentsTable;
