import { Building2 } from "lucide-react";

import type { ProductOrder, ProductOrderStatus } from "@/types";

import ProductOrdersTableActions from "./product-orders-table-actions";
import ProductOrdersTableStatusBadge from "./product-orders-table-status-badge";
import ProductOrdersTableTypeBadge from "./product-orders-table-type-badge";

function ProductOrdersTableRow({
  order,
  onStatusChange,
  onView,
}: {
  order: ProductOrder;
  onStatusChange: (status: ProductOrderStatus) => void;
  onView: () => void;
}) {
  return (
    <tr className="h-16 bg-white text-base font-medium leading-6 text-dark-gray">
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        {order.id}
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="size-4 text-gray" strokeWidth={1.75} />
          <span>{order.merchantName}</span>
        </span>
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        {order.productName}
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <span>{order.price}</span>
          <span className="text-sm text-gray">ر.س</span>
        </span>
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        <ProductOrdersTableTypeBadge type={order.type} />
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        <ProductOrdersTableStatusBadge
          status={order.status}
          onChange={onStatusChange}
        />
      </td>
      <td className="border-b border-primary/15 px-5 py-3 text-right whitespace-nowrap">
        {order.date}
      </td>
      <td className="border-b border-primary/15 px-5 py-2 text-center whitespace-nowrap">
        <ProductOrdersTableActions onView={onView} />
      </td>
    </tr>
  );
}

export default ProductOrdersTableRow;
