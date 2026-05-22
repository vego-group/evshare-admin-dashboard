import type { OrderListItem } from "@/types";

import OrdersTableHeader from "./orders-table-header";
import OrdersTableRow from "./orders-table-row";

function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-277.5 border-separate border-spacing-0 text-right">
          <OrdersTableHeader />
          <tbody>
            {orders.map((order) => (
              <OrdersTableRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrdersTable;
