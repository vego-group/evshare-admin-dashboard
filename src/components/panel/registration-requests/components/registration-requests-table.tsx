"use client";

import { useState } from "react";

import EmptyState from "@/components/ui/empty-state";
import RegistrationRequestsDetailsPanel from "../registration-requests-details-panel";
import RegistrationRequestsTableHeader from "./registration-requests-table-header";
import RegistrationRequestsTableRow from "./registration-requests-table-row";
import {
  registrationRequests,
  type RegistrationRequest,
  type RegistrationRequestStatus,
} from "./registration-requests-data";

function RegistrationRequestsTable({
  requests = registrationRequests,
}: {
  requests?: RegistrationRequest[];
}) {
  const [rows, setRows] = useState(requests);
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);

  const handleStatusChange = (
    requestId: string,
    status: RegistrationRequestStatus,
  ) => {
    setRows((currentRows) =>
      currentRows.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    );
    setSelectedRequest((currentRequest) =>
      currentRequest?.id === requestId
        ? { ...currentRequest, status }
        : currentRequest,
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
            <RegistrationRequestsTableHeader />
            <tbody>
              {rows.map((request) => (
                <RegistrationRequestsTableRow
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  onViewRequest={setSelectedRequest}
                />
              ))}
            </tbody>
          </table>
        </div>

        {!rows.length ? (
          <EmptyState description="لم نتمكن من العثور على طلبات تسجيل جرب تعديل معايير البحث" />
        ) : null}
      </section>

      <RegistrationRequestsDetailsPanel
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

export default RegistrationRequestsTable;
