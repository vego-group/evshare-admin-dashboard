import type { ReactNode } from "react";

import type { Slider } from "@/types";

import { formatDate, SliderActions, SliderThumbnail, StatusBadge } from "./slider-result-parts";

type SlidersTableProps = {
  sliders: Slider[];
  onEditSlider: (slider: Slider) => void;
  onDeleteSlider: (slider: Slider) => void;
};

function SlidersTable({ sliders, onEditSlider, onDeleteSlider }: SlidersTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>الصورة</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>تاريخ الإنشاء</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider.id} className="text-dark-gray">
                <TableCell>
                  <SliderThumbnail url={slider.image?.url} className="size-16 rounded-xl" />
                </TableCell>
                <TableCell>
                  <StatusBadge active={slider.active} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(slider.created_at)}</TableCell>
                <TableCell>
                  <SliderActions
                    onEdit={() => onEditSlider(slider)}
                    onDelete={() => onDeleteSlider(slider)}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({ children, dir }: { children: ReactNode; dir?: "ltr" | "rtl" }) {
  return <td dir={dir} className="border-b border-primary/15 px-5 py-3">{children}</td>;
}

export default SlidersTable;
