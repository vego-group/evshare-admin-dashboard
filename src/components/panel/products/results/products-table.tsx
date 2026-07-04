import { SaudiRiyal } from "lucide-react";
import type { ReactNode } from "react";

import type { ProductListItem } from "@/types";

import {
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
              <HeaderCell>الصورة</HeaderCell>
              <HeaderCell>العنوان</HeaderCell>
              <HeaderCell>التصنيف</HeaderCell>
              <HeaderCell>السعر</HeaderCell>
              <HeaderCell>الكمية</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-dark-gray">
                <TableCell truncate={false}>
                  <ProductImage product={product} />
                </TableCell>
                <TableCell>
                  <p
                    className="truncate text-base font-medium"
                    title={product.title}
                  >
                    {product.title}
                  </p>
                </TableCell>
                <TableCell>{product.category?.name ?? "-"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1" dir="ltr">
                    <SaudiRiyal className="size-4" /> {product.price}
                  </span>
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell truncate={false}>
                  <StatusBadge active={product.active} />
                </TableCell>
                <TableCell truncate={false}>
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

export default ProductsTable;


