import EmptyState from "@/components/ui/empty-state";
import type { ProductListItem } from "@/types";

import type { ProductsViewMode } from "../header";
import ProductsCards from "./products-cards";
import ProductsTable from "./products-table";

type ProductsResultsProps = {
  products: ProductListItem[];
  viewMode: ProductsViewMode;
  onViewProduct: (product: ProductListItem) => void;
  onEditProduct: (product: ProductListItem) => void;
  onDeleteProduct: (product: ProductListItem) => void;
};

function ProductsResults({
  products,
  viewMode,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsResultsProps) {
  if (!products.length) {
    return <EmptyState description="لا توجد منتجات مطابقة." />;
  }

  const props = {
    products,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
  };

  return viewMode === "table" ? (
    <ProductsTable {...props} />
  ) : (
    <ProductsCards {...props} />
  );
}

export default ProductsResults;
