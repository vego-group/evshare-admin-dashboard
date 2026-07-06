import { tripStatusOptions } from "@/data";
import type { TripStatus } from "@/types";
import FilterSelect, { type FilterOption } from "./filter-select";

const options: FilterOption<TripStatus | "all">[] = [
  { label: "كل الحالات", value: "all" },
  ...tripStatusOptions,
];

function TripStatusFilterSelect({
  value,
  onChange,
}: {
  value: TripStatus | "all";
  onChange: (value: TripStatus | "all") => void;
}) {
  return <FilterSelect label="حالة الرحلة" options={options} value={value} onChange={onChange} />;
}

export default TripStatusFilterSelect;
