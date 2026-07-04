import type { CategoryListItem } from "@/types";

import {
  CategoryActions,
  CategoryImage,
  DetailLine,
  formatProductsCount,
  StatusBadge,
} from "./category-result-parts";

type CategoriesCardsProps = {
  categories: CategoryListItem[];
  onViewCategory: (category: CategoryListItem) => void;
  onEditCategory: (category: CategoryListItem) => void;
  onDeleteCategory: (category: CategoryListItem) => void;
};

function CategoriesCards({
  categories,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <article
          key={category.id}
          className="rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="space-y-3">
            <div className="flex justify-center rounded-[14px] bg-background p-3">
              <CategoryImage category={category} className="size-24" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 text-right">
                <h3 className="truncate text-lg font-semibold text-secondary">
                  {category.name}
                </h3>
              </div>
              <div className="shrink-0">
                <StatusBadge active={category.active} />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine
              label="عدد المنتجات"
              value={formatProductsCount(category.products_count)}
            />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <CategoryActions
              compact
              onView={() => onViewCategory(category)}
              onEdit={() => onEditCategory(category)}
              onDelete={() => onDeleteCategory(category)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

export default CategoriesCards;

