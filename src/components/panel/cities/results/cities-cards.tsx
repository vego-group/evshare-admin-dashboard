import type { CityListItem } from "@/types";

import {
  CityActions,
  CityIcon,
  DetailLine,
  formatDate,
  getCityName,
  StatusBadge,
} from "./city-result-parts";

type CitiesCardsProps = {
  cities: CityListItem[];
  onEditCity: (city: CityListItem) => void;
  onDeleteCity: (city: CityListItem) => void;
};

function CitiesCards({ cities, onEditCity, onDeleteCity }: CitiesCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cities.map((city) => (
        <article
          key={city.id}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <CityIcon className="size-16" />
            <div className="min-w-0 flex-1 text-right">
              <h3 className="truncate text-lg font-semibold text-secondary">
                {getCityName(city)}
              </h3>
            </div>
            <div className="shrink-0">
              <StatusBadge active={city.active} />
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine label="الاسم العربي" value={city.name_ar} />
            <DetailLine label="الاسم الإنجليزي" value={city.name_en} />
            <DetailLine label="تاريخ الإنشاء" value={formatDate(city.created_at)} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <CityActions
              compact
              onEdit={() => onEditCity(city)}
              onDelete={() => onDeleteCity(city)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

export default CitiesCards;
