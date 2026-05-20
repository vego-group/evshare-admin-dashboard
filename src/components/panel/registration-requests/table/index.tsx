import EmptyState from "@/components/ui/empty-state";
import type { KycListItem } from "@/types";

import RegistrationRequestsTableHeader from "./registration-requests-table-header";
import RegistrationRequestsTableRow from "./registration-requests-table-row";

function RegistrationRequestsTable({
  requests,
  onRequestSelect,
}: {
  requests: KycListItem[];
  onRequestSelect?: (kycId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
          <RegistrationRequestsTableHeader />
          <tbody>
            {requests.map((request) => (
              <RegistrationRequestsTableRow
                key={request.id}
                request={request}
                onSelect={onRequestSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!requests.length ? (
        <EmptyState description="لا توجد طلبات تسجيل." />
      ) : null}
    </section>
  );
}

export default RegistrationRequestsTable;
