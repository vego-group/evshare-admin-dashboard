import type { Slider, SlidersListResponse, OrderBy, QueryParams, Status } from "@/types";

import type { SlidersViewMode } from "./header";
import SlidersPagination from "./pagination";
import SlidersResults from "./results";
import SlidersStats from "./stats";
import SlidersToolbar from "./toolbar";

type SlidersMainContentProps = {
  data?: SlidersListResponse;
  params: QueryParams;
  viewMode: SlidersViewMode;
  onParamsChange: (params: Partial<QueryParams>) => void;
  onEditSlider: (slider: Slider) => void;
  onDeleteSlider: (slider: Slider) => void;
};

function SlidersMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onEditSlider,
  onDeleteSlider,
}: SlidersMainContentProps) {
  return (
    <>
      <SlidersStats data={data?.analytics} />
      <SlidersToolbar
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        onSortChange={(order_by: OrderBy) => onParamsChange({ order_by, page: 1 })}
        onStatusChange={(status?: Status) => onParamsChange({ status, page: 1 })}
      />
      <SlidersResults
        sliders={data?.data ?? []}
        viewMode={viewMode}
        onEditSlider={onEditSlider}
        onDeleteSlider={onDeleteSlider}
      />
      <SlidersPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default SlidersMainContent;
