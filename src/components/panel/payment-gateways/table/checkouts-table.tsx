import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { PaymentCheckout } from "@/types";

import {
  formatDate,
  formatGateway,
  formatPayableType,
  MoneyValue,
} from "../utils";
import { ProcessedBadge } from "./status-badges";
import { TableCell, TableHead } from "./table-cell";

type PaymentCheckoutsTableProps = {
  checkouts: PaymentCheckout[];
  isFetching?: boolean;
  onCheckoutSelect?: (checkoutId: string) => void;
};

function PaymentCheckoutsTable({
  checkouts,
  isFetching,
  onCheckoutSelect,
}: PaymentCheckoutsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div
        className={cn(
          "overflow-x-auto transition-opacity",
          isFetching && "opacity-60",
        )}
      >
        <table className="w-full min-w-280 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-47.5">المستخدم</TableHead>
              <TableHead className="w-40">بوابة الدفع</TableHead>
              <TableHead className="w-37.5">المبلغ</TableHead>
              <TableHead className="w-40">المرجع</TableHead>
              <TableHead className="w-35">المعالجة</TableHead>
              <TableHead className="w-47.5">تاريخ الإنشاء</TableHead>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((checkout) => (
              <CheckoutTableRow
                key={checkout.id}
                checkout={checkout}
                onSelect={onCheckoutSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!checkouts.length ? (
        <EmptyState description="لا توجد عمليات تحقق دفع." />
      ) : null}
    </section>
  );
}

function CheckoutTableRow({
  checkout,
  onSelect,
}: {
  checkout: PaymentCheckout;
  onSelect?: (checkoutId: string) => void;
}) {
  return (
    <tr
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      onClick={() => onSelect?.(checkout.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(checkout.id);
        }
      }}
      className={cn(
        "text-base font-medium leading-6 text-dark-gray transition",
        onSelect &&
          "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none",
      )}
    >
      <TableCell className="max-w-47.5">
        <span className="block truncate">{checkout.user?.name ?? "-"}</span>
        <span dir="ltr" className="mt-1 block truncate text-sm text-gray">
          {checkout.user?.mobile ? `+${checkout.user.mobile}` : "-"}
        </span>
      </TableCell>
      <TableCell>{formatGateway(checkout.payment_gateway)}</TableCell>
      <TableCell dir="ltr">
        <MoneyValue amount={checkout.amount} />
      </TableCell>
      <TableCell>
        <span>{formatPayableType(checkout.payable?.type)}</span>
        <span dir="ltr" className="mt-1 block truncate text-sm text-gray">
          {checkout.payable?.uuid ?? checkout.payable?.id ?? "-"}
        </span>
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <ProcessedBadge isProcessed={checkout.is_processed} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(checkout.created_at)}</TableCell>
    </tr>
  );
}

export default PaymentCheckoutsTable;
