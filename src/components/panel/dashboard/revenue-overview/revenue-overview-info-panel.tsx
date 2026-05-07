import { Bolt } from "lucide-react";

import { TrendBadge } from "../shared";

function RevenueOverviewInfoPanel() {
  return (
    <div className="space-y-4 text-right sm:space-y-6">
      <div className="inline-flex items-center gap-2 self-end text-sm font-medium text-secondary">
        <Bolt className="size-4 text-secondary" />
        إيرادات المنصة
      </div>

      <div className="space-y-2">
        <p className="text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-dark-gray sm:text-[3rem]">
          1,247 <span className="text-lg font-medium text-gray">ر.س</span>
        </p>
        <p className="text-sm font-medium text-gray">
          إجمالي إيرادات آخر 7 أيام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TrendBadge value="21.0%" direction="up" />
        <p className="text-xs font-medium text-gray">مقارنة بالأسبوع الماضي</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">ذروة الفترة</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            246k
          </p>
          <p className="mt-1 text-xs font-medium text-gray">الخميس</p>
        </div>

        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">متوسط يومي</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            185k
          </p>
          <p className="mt-1 text-xs font-medium text-gray">ر.س / فترة</p>
        </div>
      </div>
    </div>
  );
}

export default RevenueOverviewInfoPanel;
