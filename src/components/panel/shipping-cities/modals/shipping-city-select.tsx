"use client";

import { useCities } from "@/hooks/api";

import FormSelect from "./form-select";

const UNMAPPED_VALUE = "__unmapped__";

type ShippingCitySelectProps = {
  value?: string;
  onChange: (cityId: string) => void;
};

/** Picks which of our own cities this shipping city maps to; empty means unmapped. */
function ShippingCitySelect({ value, onChange }: ShippingCitySelectProps) {
  const { data } = useCities({ page: 1, limit: 100 });

  const options = [
    { label: "بدون ربط", value: UNMAPPED_VALUE },
    ...(data?.data ?? []).map((city) => ({ label: city.name, value: city.id })),
  ];

  return (
    <FormSelect
      value={value || UNMAPPED_VALUE}
      options={options}
      placeholder="اختر المدينة"
      onChange={(selected) =>
        onChange(selected === UNMAPPED_VALUE ? "" : selected)
      }
    />
  );
}

export default ShippingCitySelect;
