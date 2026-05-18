import AssetsCatalogToolbarFilters, {
  type AssetFilterValue,
} from "./assets-catalog-toolbar-filters";
import AssetsCatalogToolbarSearch from "./assets-catalog-toolbar-search";
import type { AssetStatus, AssetType } from "@/types";

type AssetsCatalogToolbarProps = {
  searchQuery: string;
  cities: string[];
  selectedCity: string;
  selectedStatus: AssetFilterValue<AssetStatus>;
  selectedType: AssetFilterValue<AssetType>;
  onSearchChange: (value: string) => void;
  onCityChange: (city: string) => void;
  onStatusChange: (status: AssetFilterValue<AssetStatus>) => void;
  onTypeChange: (type: AssetFilterValue<AssetType>) => void;
};

function AssetsCatalogToolbar({
  searchQuery,
  cities,
  selectedCity,
  selectedStatus,
  selectedType,
  onSearchChange,
  onCityChange,
  onStatusChange,
  onTypeChange,
}: AssetsCatalogToolbarProps) {
  return (
    <>
      <AssetsCatalogToolbarSearch
        value={searchQuery}
        onChange={onSearchChange}
      />
      <AssetsCatalogToolbarFilters
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        onStatusChange={onStatusChange}
        onTypeChange={onTypeChange}
      />
    </>
  );
}

export type { AssetFilterValue };
export default AssetsCatalogToolbar;
