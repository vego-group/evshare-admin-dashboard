"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { registrationRequests } from "@/data";
import type { RegistrationRequest, RegistrationRequestStatus } from "@/types";

import RegistrationRequestsDetailsPanel from "./details-panel";
import StatsCards from "./stats";
import RegistrationRequestsTable from "./table";
import RegistrationRequestsToolbar from "./toolbar";

function RegistrationRequests() {
  const [requests, setRequests] = useState(registrationRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);

  const handleStatusChange = (
    requestId: string,
    status: RegistrationRequestStatus,
  ) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
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
    <div className="flex w-full flex-col gap-6">
      <Header title="طلبات التسجيل" subtitle="إدارة ومتابعة طلبات تسجيل" />
      <StatsCards />
      <RegistrationRequestsToolbar />
      <RegistrationRequestsTable
        requests={requests}
        onStatusChange={handleStatusChange}
        onViewRequest={setSelectedRequest}
      />
      <RegistrationRequestsDetailsPanel
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default RegistrationRequests;
