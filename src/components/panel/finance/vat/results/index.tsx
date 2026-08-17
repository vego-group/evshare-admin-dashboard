import EmptyState from "@/components/ui/empty-state";
import type { VatRecord } from "@/types";

import VatTable from "../table";

function VatResults({ records }: { records: VatRecord[] }) {
  if (!records.length) {
    return <EmptyState description="لا توجد طلبات خاضعة للضريبة." />;
  }

  return <VatTable records={records} />;
}

export default VatResults;
