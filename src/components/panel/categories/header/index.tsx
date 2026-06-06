import { LayoutGrid, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";

export type CategoriesViewMode = "table" | "card";

type CategoriesHeaderProps = {
  viewMode: CategoriesViewMode;
  onViewModeChange: (viewMode: CategoriesViewMode) => void;
  onAddCategory: () => void;
};

function CategoriesHeader({
  viewMode,
  onViewModeChange,
  onAddCategory,
}: CategoriesHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header title="التصنيفات" subtitle="إدارة ومتابعة تصنيفات المنتجات" />

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="flex h-13.25 items-center gap-1 rounded-2xl border border-neutral-100/80 bg-white p-1.5">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="عرض كروت"
            aria-pressed={viewMode === "card"}
            onClick={() => onViewModeChange("card")}
            className={cn(
              "size-10 rounded-[14px] text-gray hover:bg-neutral-50 hover:text-secondary",
              viewMode === "card" &&
                "bg-primary text-secondary shadow-sm hover:bg-primary/90",
            )}
          >
            <LayoutGrid className="size-5" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="عرض الجدول"
            aria-pressed={viewMode === "table"}
            onClick={() => onViewModeChange("table")}
            className={cn(
              "size-10 rounded-[14px] text-gray hover:bg-neutral-50 hover:text-secondary",
              viewMode === "table" &&
                "bg-primary text-secondary shadow-sm hover:bg-primary/90",
            )}
          >
            <List className="size-5" />
          </Button>
        </div>

        <Button
          type="button"
          onClick={onAddCategory}
          className="h-12 rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90"
        >
          <Plus className="size-5" />
          إضافة تصنيف
        </Button>
      </div>
    </section>
  );
}

export default CategoriesHeader;
