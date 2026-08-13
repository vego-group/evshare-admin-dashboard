"use client";

import { useOrders } from "@/hooks/api";

import FormSelect from "./form-select";

type ShipmentOrderSelectProps = {
  value?: string;
  onChange: (orderId: string) => void;
};

/** Picks the order a new shipment is raised against; drafts and cancelled orders cannot ship. */
function ShipmentOrderSelect({ value, onChange }: ShipmentOrderSelectProps) {
  const { data } = useOrders({ page: "1", limit: "100" });

  const options = (data?.data ?? [])
    .filter((order) => order.status !== "draft" && order.status !== "cancelled")
    .map((order) => ({
      label: `${order.order_code} — ${order.user?.name ?? "بدون عميل"}`,
      value: order.id,
    }));

  return (
    <FormSelect
      value={value}
      options={options}
      placeholder="اختر الطلب"
      onChange={onChange}
    />
  );
}

export default ShipmentOrderSelect;
