"use client";

import { useMemo, useState } from "react";

import {
  consultationRequests,
  type ConsultationRequestStatus,
  type ConsultationRequestType,
} from "./consultation-requests-data";
import ConsultationRequestsHeading from "./consultation-requests-heading";
import ConsultationRequestsStats from "./consultation-requests-stats";
import ConsultationRequestsTable from "./consultation-requests-table";
import ConsultationRequestsToolbar from "./consultation-requests-toolbar";
import ConsultationRequestDetailsPanel from "./consultation-request-details-panel";

type ConsultationFilterValue<T extends string> = T | "الكل";
type ConsultationSortValue = "الاحدث" | "الاقدم";

function ConsultationRequests() {
  const [requests, setRequests] = useState(consultationRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<(typeof consultationRequests)[number] | null>(null);
  const [selectedSort, setSelectedSort] =
    useState<ConsultationSortValue>("الاحدث");
  const [selectedStatus, setSelectedStatus] =
    useState<ConsultationFilterValue<ConsultationRequestStatus>>("الكل");
  const [selectedType, setSelectedType] =
    useState<ConsultationFilterValue<ConsultationRequestType>>("الكل");

  const filteredRequests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const results = requests.filter((request) => {
      const matchesSearch =
        !normalizedQuery ||
        [request.name, request.phone, request.email, request.type, request.status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        selectedStatus === "الكل" || request.status === selectedStatus;
      const matchesType = selectedType === "الكل" || request.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });

    return selectedSort === "الاحدث" ? results : [...results].reverse();
  }, [requests, searchQuery, selectedSort, selectedStatus, selectedType]);

  const handleStatusChange = (
    requestId: string,
    status: ConsultationRequestStatus,
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
      <ConsultationRequestsHeading />
      <ConsultationRequestsStats requests={requests} />
      <ConsultationRequestsToolbar
        searchQuery={searchQuery}
        selectedSort={selectedSort}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        onSearchChange={setSearchQuery}
        onSortChange={setSelectedSort}
        onStatusChange={setSelectedStatus}
        onTypeChange={setSelectedType}
      />
      <ConsultationRequestsTable
        requests={filteredRequests}
        onViewRequest={setSelectedRequest}
        onStatusChange={handleStatusChange}
      />
      <ConsultationRequestDetailsPanel
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default ConsultationRequests;
