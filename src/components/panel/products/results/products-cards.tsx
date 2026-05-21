import type { ProductListItem } from "@/types";

import {
  DetailLine,
  formatDate,
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
          <div className="flex items-start gap-3">
            <ProductImage product={product} className="size-16 shrink-0" />
            <div className="min-w-0 flex-1 text-right">
              <h3 className="truncate text-lg font-semibold text-secondary">
                {product.title}
              </h3>
              <p className="truncate text-sm text-gray">{product.category?.name ?? "-"}</p>
            </div>
            <div className="shrink-0">
              <StatusBadge active={product.active} />
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine label="السعر" value={`${product.price} SAR`} />
            <DetailLine label="الكمية" value={String(product.quantity)} />
            <DetailLine label="تاريخ الإنشاء" value={formatDate(product.created_at)} />
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
