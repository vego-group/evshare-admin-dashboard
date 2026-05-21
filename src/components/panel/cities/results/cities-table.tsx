import type { ReactNode } from "react";

import type { CityListItem } from "@/types";

import { CityActions, CityIcon, formatDate, getCityName, StatusBadge } from "./city-result-parts";

type CitiesTableProps = {
  cities: CityListItem[];
  onEditCity: (city: CityListItem) => void;
  onDeleteCity: (city: CityListItem) => void;
};

function CitiesTable({ cities, onEditCity, onDeleteCity }: CitiesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المدينة</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>تاريخ الإنشاء</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-[260px] items-center gap-3">
                    <CityIcon />
                    <p className="min-w-0 flex-1 truncate text-base font-medium" title={getCityName(city)}>
                      {getCityName(city)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge active={city.active} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(city.created_at)}</TableCell>
                <TableCell>
                  <CityActions
                    onEdit={() => onEditCity(city)}
                    onDelete={() => onDeleteCity(city)}
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

export default CitiesTable;
