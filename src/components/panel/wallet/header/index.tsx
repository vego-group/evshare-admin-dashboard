import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";

export type WalletViewMode = "table" | "card";

type WalletHeaderProps = {
  viewMode: WalletViewMode;
  onViewModeChange: (viewMode: WalletViewMode) => void;
};

function WalletHeader({ viewMode, onViewModeChange }: WalletHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header title="المحفظة" subtitle="إدارة ومتابعة معاملات المحفظة" />
      <div className="flex h-13.25 items-center gap-1 self-start rounded-2xl border border-neutral-100/80 bg-white p-1.5 sm:self-auto">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="عرض كروت"
          aria-pressed={viewMode === "card"}
          onClick={() => onViewModeChange("card")}
          className={cn(
            "size-10 rounded-[14px] text-gray hover:bg-neutral-50 hover:text-secondary",
            viewMode === "card" && "bg-primary text-secondary shadow-sm hover:bg-primary/90",
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
            viewMode === "table" && "bg-primary text-secondary shadow-sm hover:bg-primary/90",
          )}
        >
          <List className="size-5" />
        </Button>
      </div>
    </section>
  );
}

export default WalletHeader;
