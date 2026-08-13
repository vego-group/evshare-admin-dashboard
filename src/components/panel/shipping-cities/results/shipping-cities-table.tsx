import type { ReactNode } from "react";

import type { ShippingCityListItem } from "@/types";

import {
  CityIcon,
  CoverageFlags,
  MappingBadge,
  ShippingCityActions,
  StatusBadge,
} from "./shipping-city-result-parts";

type ShippingCitiesTableProps = {
  shippingCities: ShippingCityListItem[];
  onEditShippingCity: (city: ShippingCityListItem) => void;
  onDeleteShippingCity: (city: ShippingCityListItem) => void;
};

function ShippingCitiesTable({
  shippingCities,
  onEditShippingCity,
  onDeleteShippingCity,
}: ShippingCitiesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المدينة</HeaderCell>
              <HeaderCell>اسم المزود</HeaderCell>
              <HeaderCell>الدولة</HeaderCell>
              <HeaderCell>الربط</HeaderCell>
              <HeaderCell>التغطية</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {shippingCities.map((shippingCity) => (
              <tr key={shippingCity.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-64 items-center gap-3">
                    <CityIcon />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-base font-medium"
                        title={shippingCity.name}
                      >
                        {shippingCity.name}
                      </p>
                      <p className="truncate text-sm text-gray" dir="ltr">
                        {shippingCity.name_en}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr">{shippingCity.oto_name ?? "-"}</TableCell>
                <TableCell dir="ltr">{shippingCity.country_code}</TableCell>
                <TableCell truncate={false}>
                  <MappingBadge shippingCity={shippingCity} />
                </TableCell>
                <TableCell truncate={false}>
                  <CoverageFlags shippingCity={shippingCity} />
                </TableCell>
                <TableCell truncate={false}>
                  <StatusBadge active={shippingCity.active} />
                </TableCell>
                <TableCell truncate={false}>
                  <ShippingCityActions
                    onEdit={() => onEditShippingCity(shippingCity)}
                    onDelete={() => onDeleteShippingCity(shippingCity)}
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

function TableCell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default ShippingCitiesTable;
