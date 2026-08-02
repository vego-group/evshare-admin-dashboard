import type {
  PromoCodesListResponse,
  PromoCodesQueryParams,
  PromoContext,
  PromoListItem,
  PromoStatus,
} from "@/types";

import PromosPagination from "./pagination";
import PromosResults from "./results";
import PromosToolbar from "./toolbar";

type PromosMainContentProps = {
  data?: PromoCodesListResponse;
  params: PromoCodesQueryParams;
  onParamsChange: (params: Partial<PromoCodesQueryParams>) => void;
  onViewPromo: (promo: PromoListItem) => void;
  onEditPromo: (promo: PromoListItem) => void;
  onDeletePromo: (promo: PromoListItem) => void;
};

function PromosMainContent({
  data,
  params,
  onParamsChange,
  onViewPromo,
  onEditPromo,
  onDeletePromo,
}: PromosMainContentProps) {
  return (
    <>
      <PromosToolbar
        searchQuery={params.search ?? ""}
        selectedStatus={params.status}
        selectedType={params.type}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onStatusChange={(status?: PromoStatus) => onParamsChange({ status, page: 1 })}
        onTypeChange={(type?: PromoContext) => onParamsChange({ type, page: 1 })}
      />
      <PromosResults
        promos={data?.data ?? []}
        onViewPromo={onViewPromo}
        onEditPromo={onEditPromo}
        onDeletePromo={onDeletePromo}
      />
      <PromosPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default PromosMainContent;
