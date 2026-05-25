import EmptyState from "@/components/ui/empty-state";
import type { PaymentRequest } from "@/types";

import PaymentRequestsTableHeader from "./payment-requests-table-header";
import PaymentRequestsTableRow from "./payment-requests-table-row";

function PaymentRequestsTable({
  requests,
  onRequestSelect,
}: {
  requests: PaymentRequest[];
  onRequestSelect?: (paymentRequestId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
          <PaymentRequestsTableHeader />
          <tbody>
            {requests.map((request) => (
              <PaymentRequestsTableRow
                key={request.id}
                request={request}
                onSelect={onRequestSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!requests.length ? (
        <EmptyState description="لا توجد طلبات دفع." />
      ) : null}
    </section>
  );
}

export default PaymentRequestsTable;
