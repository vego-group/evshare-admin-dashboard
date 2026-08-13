import EmptyState from "@/components/ui/empty-state";
import type { ShippingCityListItem } from "@/types";

import ShippingCitiesTable from "./shipping-cities-table";

type ShippingCitiesResultsProps = {
  shippingCities: ShippingCityListItem[];
  onEditShippingCity: (city: ShippingCityListItem) => void;
  onDeleteShippingCity: (city: ShippingCityListItem) => void;
};

function ShippingCitiesResults({
  shippingCities,
  onEditShippingCity,
  onDeleteShippingCity,
}: ShippingCitiesResultsProps) {
  if (!shippingCities.length) {
    return <EmptyState description="لا توجد مدن شحن مطابقة." />;
  }

  return (
    <ShippingCitiesTable
      shippingCities={shippingCities}
      onEditShippingCity={onEditShippingCity}
      onDeleteShippingCity={onDeleteShippingCity}
    />
  );
}

export default ShippingCitiesResults;
