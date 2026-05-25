"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

import { useCategories } from "@/hooks/api";
import { cn } from "@/lib/utils";


type CategoryFilterSelectProps = {
  value?: string;
  onChange: (categoryId?: string) => void;
};

function CategoryFilterSelect({ value, onChange }: CategoryFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useCategories({ page: 1, limit: 100 });
  const categories = data?.data ?? [];
  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex items-center gap-1 min-w-0">
          <span className="truncate">
            {selectedCategory?.name ?? "التصنيف"}
          </span>
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />}
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(undefined); setIsOpen(false); }}
              className={cn(
                "flex min-h-10 w-full items-center justify-start px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                !value && "bg-primary/15 text-secondary",
              )}
            >
              الكل
            </button>
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray">لا توجد تصنيفات</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => { onChange(category.id); setIsOpen(false); }}
                  className={cn(
                    "flex min-h-10 w-full items-center justify-start px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    value === category.id && "bg-primary/15 text-secondary",
                  )}
                >
                  <span className="break-all">{category.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CategoryFilterSelect;
