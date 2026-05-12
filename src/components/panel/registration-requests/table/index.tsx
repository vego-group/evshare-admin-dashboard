import EmptyState from "@/components/ui/empty-state";
import type { RegistrationRequest, RegistrationRequestStatus } from "@/types";

import RegistrationRequestsTableHeader from "./registration-requests-table-header";
import RegistrationRequestsTableRow from "./registration-requests-table-row";

function RegistrationRequestsTable({
  requests,
  onStatusChange,
  onViewRequest,
}: {
  requests: RegistrationRequest[];
  onStatusChange?: (
    requestId: string,
    status: RegistrationRequestStatus,
  ) => void;
  onViewRequest?: (request: RegistrationRequest) => void;
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
                onStatusChange={onStatusChange}
                onViewRequest={onViewRequest}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!requests.length ? (
        <EmptyState description="No registration requests found." />
      ) : null}
    </section>
  );
}

export default RegistrationRequestsTable;
