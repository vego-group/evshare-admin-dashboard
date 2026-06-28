import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MobilityReceiptPaginationMeta } from "@/types";

type Props = {
  currentPage: number;
  meta?: MobilityReceiptPaginationMeta;
  onPageChange: (page: number) => void;
};

function MobilityReceiptsPagination({ currentPage, meta, onPageChange }: Props) {
  if (!meta || meta.lastPage <= 1) return null;
  const activePage = clamp(currentPage, 1, meta.lastPage);
  const pages = getVisiblePages(activePage, meta.lastPage);
  const from = (activePage - 1) * meta.perPage + 1;
  const to = Math.min(activePage * meta.perPage, meta.total);

  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-dark-gray">
      <p className="order-2 text-center">
        عرض {from}-{to} من {meta.total}
      </p>
      <div className="order-1 flex items-center justify-center gap-2" dir="ltr">
        <Button type="button" variant="outline" size="icon-sm" disabled={activePage <= 1} onClick={() => onPageChange(activePage - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        {pages.map((page) => (
          <Button key={page} type="button" variant={page === activePage ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)} className="min-w-8">
            {page}
          </Button>
        ))}
        <Button type="button" variant="outline" size="icon-sm" disabled={activePage >= meta.lastPage} onClick={() => onPageChange(activePage + 1)}>
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
  return Array.from({ length: end - normalizedStart + 1 }, (_, i) => normalizedStart + i);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default MobilityReceiptsPagination;
