"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useSliders } from "@/hooks/api";
import { deleteSlider } from "@/services/mutations";
import type { Slider, QueryParams } from "@/types";

import SlidersMainContent from "./sliders-main-content";
import SlidersContentShimmer from "./content-shimmer";
import SlidersHeader, { type SlidersViewMode } from "./header";
import { SliderAddModal, SliderDeleteConfirmModal, SliderEditModal } from "./modals";

function Sliders() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<SlidersViewMode>("table");
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sliderPendingEdit, setSliderPendingEdit] = useState<Slider | null>(null);
  const [sliderPendingDelete, setSliderPendingDelete] = useState<Slider | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useSliders(params);

  const updateParams = (nextParams: Partial<QueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshSliderQueries() {
    await queryClient.invalidateQueries({ queryKey: ["sliders"] });
  }

  async function handleDeleteSlider() {
    if (!sliderPendingDelete || isDeleting) return;
    const current = sliderPendingDelete;
    setIsDeleting(true);
    const result = await deleteSlider(current.id);
    setIsDeleting(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف السلايدر بنجاح");
      setSliderPendingDelete(null);
      await refreshSliderQueries();
      return;
    }
    toast.error(result?.message || "فشل حذف السلايدر");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <SlidersContentShimmer />
      ) : (
        <>
          <SlidersHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddSlider={() => setIsAddModalOpen(true)}
          />
          <SlidersMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onEditSlider={setSliderPendingEdit}
            onDeleteSlider={setSliderPendingDelete}
          />
        </>
      )}

      <SliderAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={refreshSliderQueries}
      />

      <SliderEditModal
        key={sliderPendingEdit?.id ?? "edit-slider"}
        open={Boolean(sliderPendingEdit)}
        slider={sliderPendingEdit ?? undefined}
        onClose={() => setSliderPendingEdit(null)}
        onSaved={refreshSliderQueries}
      />

      <SliderDeleteConfirmModal
        open={Boolean(sliderPendingDelete)}
        isDeleting={isDeleting}
        onClose={() => { if (!isDeleting) setSliderPendingDelete(null); }}
        onConfirm={handleDeleteSlider}
      />
    </div>
  );
}

export default Sliders;
