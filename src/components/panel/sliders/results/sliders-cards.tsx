import Image from "next/image";

import type { Slider } from "@/types";

import { DetailLine, formatDate, SliderActions, SliderThumbnail, StatusBadge } from "./slider-result-parts";

type SlidersCardsProps = {
  sliders: Slider[];
  onEditSlider: (slider: Slider) => void;
  onDeleteSlider: (slider: Slider) => void;
};

function SlidersCards({ sliders, onEditSlider, onDeleteSlider }: SlidersCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sliders.map((slider) => (
        <article
          key={slider.id}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-neutral-100">
            {slider.image?.url ? (
              <Image
                src={slider.image.url}
                alt="صورة السلايدر"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <SliderThumbnail className="size-16" />
              </div>
            )}
            <div className="absolute left-3 top-3">
              <StatusBadge active={slider.active} />
            </div>
          </div>

          <div className="space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine label="تاريخ الإنشاء" value={formatDate(slider.created_at)} />
            <DetailLine label="تاريخ التحديث" value={formatDate(slider.updated_at)} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <SliderActions
              compact
              onEdit={() => onEditSlider(slider)}
              onDelete={() => onDeleteSlider(slider)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

export default SlidersCards;
