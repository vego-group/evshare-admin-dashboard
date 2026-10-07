import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaymentTransaction } from "@/types";

import {
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
  onRefund?: (transaction: PaymentTransaction) => void;
};

function PaymentTransactionsTable({
  transactions,
  isFetching,
  onTransactionSelect,
  onRefund,
}: PaymentTransactionsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div
        className={cn(
          "overflow-x-auto transition-opacity",
          isFetching && "opacity-60",
        )}
      >
        <table className="w-full table-fixed border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-60">رقم المعاملة</TableHead>
              <TableHead className="w-48">المستخدم</TableHead>
              <TableHead className="w-40">بوابة الدفع</TableHead>
              <TableHead className="w-40">طريقة الدفع</TableHead>
              <TableHead className="w-37.5">المبلغ</TableHead>
              <TableHead className="w-37.5">الحالة</TableHead>
              <TableHead className="w-40">الاسترداد</TableHead>
              {onRefund ? <TableHead className="w-28">الإجراء</TableHead> : null}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onSelect={onTransactionSelect}
                onRefund={onRefund}
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
  onRefund,
}: {
  transaction: PaymentTransaction;
  onSelect?: (transactionId: string) => void;
  onRefund?: (transaction: PaymentTransaction) => void;
}) {
  const user = transaction.user ?? transaction.checkout?.user;

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
        <span className="block truncate">{transaction.reference ?? transaction.transaction_id}</span>
        {transaction.reference && transaction.reference !== transaction.transaction_id ? <span className="mt-1 block truncate text-xs text-gray">{transaction.transaction_id}</span> : null}
      </TableCell>
      <TableCell><span className="block truncate">{user?.name ?? "-"}</span><span dir="ltr" className="mt-1 block text-xs text-gray">{user?.mobile ?? "-"}</span></TableCell>
      <TableCell>{formatGateway(transaction.payment_gateway)}</TableCell>
      <TableCell>{formatPaymentMethod(transaction)}</TableCell>
      <TableCell dir="ltr">
        <MoneyValue amount={transaction.amount} currency={transaction.currency} />
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <TransactionStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>
        {transaction.refund_in_progress ? <span className="text-sm text-orange-500">قيد المعالجة</span>
          : transaction.refund_status === "refunded" ? <span className="text-sm text-purple-700">مسترد بالكامل</span>
          : transaction.refund_status === "partially_refunded" ? <span className="text-sm text-blue">مسترد جزئياً</span>
          : <span className="text-sm text-gray">لا يوجد</span>}
      </TableCell>
      {onRefund ? <TableCell>
        {transaction.refundable && !transaction.refund_in_progress ? <Button type="button" size="sm" onClick={(event) => { event.stopPropagation(); onRefund(transaction); }}>استرداد</Button> : "-"}
      </TableCell> : null}
    </tr>
  );
}

export default PaymentTransactionsTable;
