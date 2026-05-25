import { complaintsAPI, singleComplaintAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import { ComplaintsQueryParams } from "@/types/complaints";

export function useComplaints(params: ComplaintsQueryParams) {
  return useCustomQuery(["complaints", params], async () =>
    complaintsAPI(params),
  );
}

export function useComplaint(complaintId: string | null) {
  return useCustomQuery(
    ["complaint", complaintId],
    async () => singleComplaintAPI(complaintId!),
    { enabled: Boolean(complaintId) },
  );
}
