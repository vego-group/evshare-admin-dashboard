import type {
  OrderBy,
  ProductListItem,
  ProductsListResponse,
  ProductsQueryParams,
  Status,
} from "@/types";

import type { ProductsViewMode } from "./header";
import ProductsPagination from "./pagination";
import ProductsResults from "./results";
import ProductsStats from "./stats";
import ProductsToolbar from "./toolbar";

type ProductsMainContentProps = {
  data?: ProductsListResponse;
  params: ProductsQueryParams;
  viewMode: ProductsViewMode;
  onParamsChange: (params: Partial<ProductsQueryParams>) => void;
  onViewProduct: (product: ProductListItem) => void;
  onEditProduct: (product: ProductListItem) => void;
  onDeleteProduct: (product: ProductListItem) => void;
};

function ProductsMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsMainContentProps) {
  return (
    <>
      <ProductsStats data={data?.analytics} />
      <ProductsToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        onSearchChange={(search) =>
          onParamsChange({ search: search || undefined, page: 1 })
        }
        onSortChange={(order_by: OrderBy) =>
          onParamsChange({ order_by, page: 1 })
        }
        onStatusChange={(status?: Status) => onParamsChange({ status, page: 1 })}
      />
      <ProductsResults
        products={data?.data ?? []}
        viewMode={viewMode}
        onViewProduct={onViewProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
      <ProductsPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default ProductsMainContent;
