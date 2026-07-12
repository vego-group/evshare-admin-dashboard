import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { WebhookLog } from "@/types";

import { formatDate, formatGateway } from "../utils";
import { ProcessedBadge } from "./status-badges";
import { TableCell, TableHead } from "./table-cell";

type WebhookLogsTableProps = {
  logs: WebhookLog[];
  isFetching?: boolean;
  onLogSelect?: (logId: string) => void;
};

function WebhookLogsTable({
  logs,
  isFetching,
  onLogSelect,
}: WebhookLogsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div
        className={cn(
          "overflow-x-auto transition-opacity",
          isFetching && "opacity-60",
        )}
      >
        <table className="w-full min-w-4xl border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-50">المعرف</TableHead>
              <TableHead className="w-40">بوابة الدفع</TableHead>
              <TableHead className="w-35">حالة المعالجة</TableHead>
              <TableHead className="w-47.5">تاريخ الاستلام</TableHead>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <WebhookLogTableRow
                key={log.id}
                log={log}
                onSelect={onLogSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!logs.length ? (
        <EmptyState description="لا توجد سجلات ويب هوك." />
      ) : null}
    </section>
  );
}

function WebhookLogTableRow({
  log,
  onSelect,
}: {
  log: WebhookLog;
  onSelect?: (logId: string) => void;
}) {
  return (
    <tr
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      onClick={() => onSelect?.(log.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(log.id);
        }
      }}
      className={cn(
        "text-base font-medium leading-6 text-dark-gray transition",
        onSelect &&
          "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none",
      )}
    >
      <TableCell dir="ltr">{log.id}</TableCell>
      <TableCell>{formatGateway(log.payment_gateway)}</TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <ProcessedBadge isProcessed={log.is_processed} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(log.created_at)}</TableCell>
    </tr>
  );
}

export default WebhookLogsTable;
