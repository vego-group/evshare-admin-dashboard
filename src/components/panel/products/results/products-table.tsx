import type { ReactNode } from "react";

import type { ProductListItem } from "@/types";

import {
  formatDate,
  ProductActions,
  ProductImage,
  StatusBadge,
} from "./product-result-parts";

type ProductsTableProps = {
  products: ProductListItem[];
  onViewProduct: (product: ProductListItem) => void;
  onEditProduct: (product: ProductListItem) => void;
  onDeleteProduct: (product: ProductListItem) => void;
};

function ProductsTable({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المنتج</HeaderCell>
              <HeaderCell>التصنيف</HeaderCell>
              <HeaderCell>السعر</HeaderCell>
              <HeaderCell>الكمية</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>تاريخ الإنشاء</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-[260px] items-center gap-3">
                    <ProductImage product={product} />
                    <p
                      className="min-w-0 flex-1 truncate text-base font-medium"
                      title={product.title}
                    >
                      {product.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{product.category?.name ?? "-"}</TableCell>
                <TableCell>{product.price} SAR</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <StatusBadge active={product.active} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(product.created_at)}</TableCell>
                <TableCell>
                  <ProductActions
                    onView={() => onViewProduct(product)}
                    onEdit={() => onEditProduct(product)}
                    onDelete={() => onDeleteProduct(product)}
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
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td dir={dir} className="border-b border-primary/15 px-5 py-3">
      {children}
    </td>
  );
}

export default ProductsTable;
