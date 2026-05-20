import type { CategoryListItem } from "@/types";

import {
  CategoryActions,
  CategoryImage,
  DetailLine,
  formatDate,
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
          <div className="flex items-start gap-3">
            <CategoryImage category={category} className="size-16" />
            <div className="min-w-0 flex-1 text-right">
              <h3 className="truncate text-lg font-semibold text-secondary">
                {category.name}
              </h3>
            </div>
            <StatusBadge active={category.active} />
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine
              label="عدد المنتجات"
              value={formatProductsCount(category.products_count)}
            />
            <DetailLine
              label="تاريخ الإنشاء"
              value={formatDate(category.created_at)}
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
