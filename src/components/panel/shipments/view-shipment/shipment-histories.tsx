import { shipmentHistorySourceLabels, shipmentStatusClasses } from "@/data";
import { cn } from "@/lib/utils";
import type { ShipmentHistory } from "@/types";

import { formatDate } from "../results/shipment-result-parts";

type ShipmentHistoriesProps = {
  histories: ShipmentHistory[];
};

function ShipmentHistories({ histories }: ShipmentHistoriesProps) {
  if (!histories.length) {
    return (
      <div className="flex min-h-30 items-center justify-center rounded-[10px] bg-white px-4 text-center text-sm text-gray">
        لا يوجد سجل حالات لهذه الشحنة بعد.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {histories.map((history) => (
        <li
          key={history.id}
          className="space-y-2 rounded-[10px] bg-white px-4 py-3 text-right"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
                shipmentStatusClasses[history.status],
              )}
            >
              {history.status_label}
            </span>
            <span className="text-sm text-gray" dir="ltr">
              {formatDate(history.occurred_at)}
            </span>
          </div>

          {history.description ? (
            <p className="break-all text-sm text-secondary">
              {history.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray">
            <span>
              المصدر: {shipmentHistorySourceLabels[history.source] ?? history.source}
            </span>
            {history.user ? <span>بواسطة: {history.user.name}</span> : null}
            {history.current_city ? (
              <span>الموقع: {history.current_city}</span>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default ShipmentHistories;
