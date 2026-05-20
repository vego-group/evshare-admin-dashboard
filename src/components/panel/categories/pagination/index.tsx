"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoriesPaginationMeta } from "@/types";

type CategoriesPaginationProps = {
  meta?: CategoriesPaginationMeta;
  onPageChange: (page: number) => void;
};

function CategoriesPagination({ meta, onPageChange }: CategoriesPaginationProps) {
  if (!meta || meta.lastPage <= 1) return null;

  const pages = getVisiblePages(meta.currentPage, meta.lastPage);
  const from = (meta.currentPage - 1) * meta.perPage + 1;
  const to = Math.min(meta.currentPage * meta.perPage, meta.total);

  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-dark-gray">
      <p className="order-2 text-center">
        عرض {from}-{to} من {meta.total}
      </p>

      <div className="order-1 flex items-center justify-center gap-2" dir="ltr">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          aria-label="الصفحة السابقة"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            variant={page === meta.currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-8"
          >
            {page}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          aria-label="الصفحة التالية"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function getVisiblePages(currentPage: number, lastPage: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, start + 4);
  const normalizedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - normalizedStart + 1 },
    (_, index) => normalizedStart + index,
  );
}

export default CategoriesPagination;
