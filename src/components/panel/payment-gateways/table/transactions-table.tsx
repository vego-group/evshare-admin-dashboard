import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { PaymentTransaction } from "@/types";

import {
  formatDate,
  formatGateway,
  formatPaymentMethod,
  MoneyValue,
} from "../utils";
import { TransactionStatusBadge } from "./status-badges";
import { TableCell, TableHead } from "./table-cell";

type PaymentTransactionsTableProps = {
  transactions: PaymentTransaction[];
  isFetching?: boolean;
  onTransactionSelect?: (transactionId: string) => void;
};

function PaymentTransactionsTable({
  transactions,
  isFetching,
  onTransactionSelect,
}: PaymentTransactionsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div
        className={cn(
          "overflow-x-auto transition-opacity",
          isFetching && "opacity-60",
        )}
      >
        <table className="w-full min-w-290 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-60">رقم المعاملة</TableHead>
              <TableHead className="w-40">بوابة الدفع</TableHead>
              <TableHead className="w-40">طريقة الدفع</TableHead>
              <TableHead className="w-37.5">المبلغ</TableHead>
              <TableHead className="w-37.5">الحالة</TableHead>
              <TableHead className="w-47.5">تاريخ الإنشاء</TableHead>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onSelect={onTransactionSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!transactions.length ? (
        <EmptyState description="لا توجد معاملات دفع." />
      ) : null}
    </section>
  );
}

function TransactionTableRow({
  transaction,
  onSelect,
}: {
  transaction: PaymentTransaction;
  onSelect?: (transactionId: string) => void;
}) {
  return (
    <tr
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      onClick={() => onSelect?.(transaction.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(transaction.id);
        }
      }}
      className={cn(
        "text-base font-medium leading-6 text-dark-gray transition",
        onSelect &&
          "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none",
      )}
    >
      <TableCell dir="ltr" className="max-w-60">
        <span className="block truncate">{transaction.transaction_id}</span>
      </TableCell>
      <TableCell>{formatGateway(transaction.payment_gateway)}</TableCell>
      <TableCell>{formatPaymentMethod(transaction)}</TableCell>
      <TableCell dir="ltr">
        <MoneyValue amount={transaction.amount} />
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <TransactionStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(transaction.created_at)}</TableCell>
    </tr>
  );
}

export default PaymentTransactionsTable;
