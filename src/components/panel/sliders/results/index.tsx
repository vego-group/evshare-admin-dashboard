import EmptyState from "@/components/ui/empty-state";
import type { Slider } from "@/types";

import type { SlidersViewMode } from "../header";
import SlidersCards from "./sliders-cards";
import SlidersTable from "./sliders-table";

type SlidersResultsProps = {
  sliders: Slider[];
  viewMode: SlidersViewMode;
  onEditSlider: (slider: Slider) => void;
  onDeleteSlider: (slider: Slider) => void;
};

function SlidersResults({ sliders, viewMode, onEditSlider, onDeleteSlider }: SlidersResultsProps) {
  if (!sliders.length) {
    return <EmptyState description="لا توجد سلايدرات مطابقة." />;
  }

  const props = { sliders, onEditSlider, onDeleteSlider };

  return viewMode === "table" ? <SlidersTable {...props} /> : <SlidersCards {...props} />;
}

export default SlidersResults;
