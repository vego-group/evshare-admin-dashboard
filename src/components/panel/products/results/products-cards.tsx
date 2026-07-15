import { SaudiRiyal } from "lucide-react";

import type { ProductListItem } from "@/types";

import {
  DetailLine,
  ProductActions,
  ProductImage,
  StatusBadge,
} from "./product-result-parts";

type ProductsCardsProps = {
  products: ProductListItem[];
  onViewProduct: (product: ProductListItem) => void;
  onEditProduct: (product: ProductListItem) => void;
  onDeleteProduct: (product: ProductListItem) => void;
};

function ProductsCards({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="space-y-3">
            <div className="flex justify-center rounded-[14px] bg-background p-3">
              <ProductImage product={product} className="size-24" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 text-right">
                <h3 className="truncate text-lg font-semibold text-secondary">
                  {product.title}
                </h3>
                <p className="truncate text-sm text-gray">
                  {product.category?.name ?? "-"}
                </p>
              </div>
              <div className="shrink-0">
                <StatusBadge active={product.active} />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine
              label="السعر"
              value={
                <span className="inline-flex items-center gap-1" dir="ltr">
                  <SaudiRiyal className="size-4 shrink-0" /> {product.price}
                </span>
              }
            />
            <DetailLine label="الكمية" value={String(product.quantity)} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <ProductActions
              compact
              onView={() => onViewProduct(product)}
              onEdit={() => onEditProduct(product)}
              onDelete={() => onDeleteProduct(product)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProductsCards;

