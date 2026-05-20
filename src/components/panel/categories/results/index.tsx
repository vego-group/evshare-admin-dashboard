import EmptyState from "@/components/ui/empty-state";
import type { CategoryListItem } from "@/types";

import type { CategoriesViewMode } from "../header";
import CategoriesCards from "./categories-cards";
import CategoriesTable from "./categories-table";

type CategoriesResultsProps = {
  categories: CategoryListItem[];
  viewMode: CategoriesViewMode;
  onViewCategory: (category: CategoryListItem) => void;
  onEditCategory: (category: CategoryListItem) => void;
  onDeleteCategory: (category: CategoryListItem) => void;
};

function CategoriesResults({
  categories,
  viewMode,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesResultsProps) {
  if (!categories.length) {
    return <EmptyState description="لا توجد تصنيفات مطابقة." />;
  }

  const props = {
    categories,
    onViewCategory,
    onEditCategory,
    onDeleteCategory,
  };

  return viewMode === "table" ? (
    <CategoriesTable {...props} />
  ) : (
    <CategoriesCards {...props} />
  );
}

export default CategoriesResults;
