"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { useCategories } from "@/hooks/api";
import { cn } from "@/lib/utils";
import type { ProductFormValues } from "@/schemas/products";

type ProductCategorySelectProps = {
  value: string;
  setValue: UseFormSetValue<ProductFormValues>;
};

function ProductCategorySelect({ value, setValue }: ProductCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useCategories({ page: 1, limit: 100 });
  const categories = data?.data ?? [];
  const selectedCategory = categories.find((c) => c.id === value);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative min-h-14 w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex min-h-14 w-full items-center justify-between gap-2 rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className={cn("break-all text-right", selectedCategory ? "text-dark-gray" : "text-[#99a1af]")}>
          {selectedCategory?.name ?? "اختر التصنيف"}
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="dashboard-dropdown-scroll">
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray">لا توجد تصنيفات</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setValue("category_id", category.id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-start px-4 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
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

export default ProductCategorySelect;
