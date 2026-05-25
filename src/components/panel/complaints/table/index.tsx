import EmptyState from "@/components/ui/empty-state";
import type { Complaint } from "@/types";

import ComplaintsTableHeader from "./complaints-table-header";
import ComplaintsTableRow from "./complaints-table-row";

function ComplaintsTable({
  complaints,
  onComplaintSelect,
}: {
  complaints: Complaint[];
  onComplaintSelect?: (complaintId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
          <ComplaintsTableHeader />
          <tbody>
            {complaints.map((complaint) => (
              <ComplaintsTableRow
                key={complaint.id}
                complaint={complaint}
                onSelect={onComplaintSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!complaints.length ? (
        <EmptyState description="لا توجد شكاوى." />
      ) : null}
    </section>
  );
}

export default ComplaintsTable;
