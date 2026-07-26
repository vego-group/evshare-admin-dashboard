import EmptyState from "@/components/ui/empty-state";
import type { PromoListItem } from "@/types";

import PromosTable from "./promos-table";

type PromosResultsProps = {
  promos: PromoListItem[];
  onViewPromo: (promo: PromoListItem) => void;
  onEditPromo: (promo: PromoListItem) => void;
  onDeletePromo: (promo: PromoListItem) => void;
};

function PromosResults({ promos, onViewPromo, onEditPromo, onDeletePromo }: PromosResultsProps) {
  if (!promos.length) {
    return <EmptyState description="لا توجد أكواد خصم مطابقة." />;
  }

  return (
    <PromosTable
      promos={promos}
      onViewPromo={onViewPromo}
      onEditPromo={onEditPromo}
      onDeletePromo={onDeletePromo}
    />
  );
}

export default PromosResults;
