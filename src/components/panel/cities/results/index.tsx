import EmptyState from "@/components/ui/empty-state";
import type { CityListItem } from "@/types";

import type { CitiesViewMode } from "../header";
import CitiesCards from "./cities-cards";
import CitiesTable from "./cities-table";

type CitiesResultsProps = {
  cities: CityListItem[];
  viewMode: CitiesViewMode;
  onEditCity: (city: CityListItem) => void;
  onDeleteCity: (city: CityListItem) => void;
};

function CitiesResults({ cities, viewMode, onEditCity, onDeleteCity }: CitiesResultsProps) {
  if (!cities.length) {
    return <EmptyState description="لا توجد مدن مطابقة." />;
  }

  const props = { cities, onEditCity, onDeleteCity };

  return viewMode === "table" ? <CitiesTable {...props} /> : <CitiesCards {...props} />;
}

export default CitiesResults;
