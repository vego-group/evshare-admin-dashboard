import type { ProductOrder, ProductOrderStatus } from "@/types";

import ProductOrdersTableHeader from "./product-orders-table-header";
import ProductOrdersTableRow from "./product-orders-table-row";

function ProductOrdersTable({
  orders,
  onStatusChange,
  onViewOrder,
}: {
  orders: ProductOrder[];
  onStatusChange: (index: number, status: ProductOrderStatus) => void;
  onViewOrder: (order: ProductOrder) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table dir="rtl" className="w-full min-w-[1024px] border-collapse">
          <ProductOrdersTableHeader />
          <tbody>
            {orders.map((order, index) => (
              <ProductOrdersTableRow
                key={`${order.id}-${order.merchantName}-${index}`}
                order={order}
                onStatusChange={(status) => onStatusChange(index, status)}
                onView={() => onViewOrder(order)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductOrdersTable;
