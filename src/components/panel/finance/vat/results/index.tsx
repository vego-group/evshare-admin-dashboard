import EmptyState from "@/components/ui/empty-state";
import type { VatRecord } from "@/types";

import VatTable from "../table";
import VatTableShimmer from "../table/vat-table-shimmer";

function VatResults({
  records,
  isLoading = false,
}: {
  records: VatRecord[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <VatTableShimmer />;
  }

  if (!records.length) {
    return <EmptyState description="لا توجد طلبات خاضعة للضريبة." />;
  }

  return <VatTable records={records} />;
}

export default VatResults;
