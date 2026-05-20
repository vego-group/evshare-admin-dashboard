import type {
  CategoriesListResponse,
  CategoryListItem,
  OrderBy,
  QueryParams,
  Status,
} from "@/types";

import type { CategoriesViewMode } from "./header";
import CategoriesPagination from "./pagination";
import CategoriesResults from "./results";
import CategoriesStats from "./stats";
import CategoriesToolbar from "./toolbar";

type CategoriesMainContentProps = {
  data?: CategoriesListResponse;
  params: QueryParams;
  viewMode: CategoriesViewMode;
  onParamsChange: (params: Partial<QueryParams>) => void;
  onViewCategory: (category: CategoryListItem) => void;
  onEditCategory: (category: CategoryListItem) => void;
  onDeleteCategory: (category: CategoryListItem) => void;
};

function CategoriesMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesMainContentProps) {
  return (
    <>
      <CategoriesStats data={data?.analytics} />
      <CategoriesToolbar
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
      <CategoriesResults
        categories={data?.data ?? []}
        viewMode={viewMode}
        onViewCategory={onViewCategory}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
      <CategoriesPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default CategoriesMainContent;
