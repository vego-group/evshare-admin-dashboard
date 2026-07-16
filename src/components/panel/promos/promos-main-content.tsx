import type { PromoCodesListResponse, PromoCodesQueryParams, PromoListItem } from "@/types";

import PromosPagination from "./pagination";
import PromosResults from "./results";
import PromosToolbar from "./toolbar";

type PromosMainContentProps = {
  data?: PromoCodesListResponse;
  params: PromoCodesQueryParams;
  onParamsChange: (params: Partial<PromoCodesQueryParams>) => void;
  onEditPromo: (promo: PromoListItem) => void;
  onDeletePromo: (promo: PromoListItem) => void;
};

function PromosMainContent({
  data,
  params,
  onParamsChange,
  onEditPromo,
  onDeletePromo,
}: PromosMainContentProps) {
  return (
    <>
      <PromosToolbar
        searchQuery={params.search ?? ""}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
      />
      <PromosResults promos={data?.data ?? []} onEditPromo={onEditPromo} onDeletePromo={onDeletePromo} />
      <PromosPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default PromosMainContent;
