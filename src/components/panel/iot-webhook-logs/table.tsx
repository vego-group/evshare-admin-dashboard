import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { IotWebhookLog } from "@/types";

import { formatIotWebhookDate, formatIotWebhookValue } from "./utils";

export function HandledBadge({ handled }: { handled: boolean }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", handled ? "bg-green-50 text-green" : "bg-amber-50 text-orange-500")}>
      {handled ? "تمت المعالجة" : "لم تتم المعالجة"}
    </span>
  );
}

export default function IotWebhookLogsTable({ logs, isFetching, onSelect }: { logs: IotWebhookLog[]; isFetching?: boolean; onSelect?: (id: string) => void }) {
  const headings = ["المعرف", "الجهاز", "نوع الحدث", "المستأجر", "الحالة", "تاريخ الاستلام"];
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className={cn("overflow-x-auto transition-opacity", isFetching && "opacity-60")}>
        <table className="w-full min-w-6xl border-separate border-spacing-0 text-right">
          <thead><tr className="bg-primary/8 text-base font-semibold text-dark-gray">{headings.map((heading) => <th key={heading} className="border-b border-primary/15 px-5 py-5">{heading}</th>)}</tr></thead>
          <tbody>{logs.map((log) => (
            <tr
              key={log.id}
              tabIndex={onSelect ? 0 : undefined}
              role={onSelect ? "button" : undefined}
              onClick={() => onSelect?.(log.id)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect?.(log.id); } }}
              className={cn("text-sm font-medium text-dark-gray transition", onSelect && "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none")}
            >
              <td dir="ltr" className="max-w-52 truncate border-b border-primary/15 px-5 py-4 text-right">{log.id}</td>
              <td dir="ltr" className="border-b border-primary/15 px-5 py-4 text-right">{formatIotWebhookValue(log.device_id)}</td>
              <td dir="ltr" className="border-b border-primary/15 px-5 py-4 text-right">{formatIotWebhookValue(log.kind)}</td>
              <td dir="ltr" className="border-b border-primary/15 px-5 py-4 text-right">{formatIotWebhookValue(log.tenant)}</td>
              <td className="border-b border-primary/15 px-5 py-4"><HandledBadge handled={log.handled} /></td>
              <td dir="ltr" className="border-b border-primary/15 px-5 py-4 text-right">{formatIotWebhookDate(log.created_at)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {!logs.length && <EmptyState description="لا توجد سجلات ويب هوك لإنترنت الأشياء." />}
    </section>
  );
}
