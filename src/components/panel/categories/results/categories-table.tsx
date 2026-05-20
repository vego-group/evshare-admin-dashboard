import type { ReactNode } from "react";

import type { CategoryListItem } from "@/types";

import {
  CategoryActions,
  CategoryImage,
  formatDate,
  formatProductsCount,
  StatusBadge,
} from "./category-result-parts";

type CategoriesTableProps = {
  categories: CategoryListItem[];
  onViewCategory: (category: CategoryListItem) => void;
  onEditCategory: (category: CategoryListItem) => void;
  onDeleteCategory: (category: CategoryListItem) => void;
};

function CategoriesTable({
  categories,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>التصنيف</HeaderCell>
              <HeaderCell>عدد المنتجات</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>تاريخ الإنشاء</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-[260px] items-center gap-3">
                    <CategoryImage category={category} />
                    <p
                      className="min-w-0 flex-1 truncate text-base font-medium"
                      title={category.name}
                    >
                      {category.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{formatProductsCount(category.products_count)}</TableCell>
                <TableCell>
                  <StatusBadge active={category.active} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(category.created_at)}</TableCell>
                <TableCell>
                  <CategoryActions
                    onView={() => onViewCategory(category)}
                    onEdit={() => onEditCategory(category)}
                    onDelete={() => onDeleteCategory(category)}
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

export default CategoriesTable;
