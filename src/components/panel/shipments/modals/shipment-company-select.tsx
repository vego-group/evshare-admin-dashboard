"use client";

import { useShippingCompanies } from "@/hooks/api";

import FormSelect from "./form-select";

type ShipmentCompanySelectProps = {
  value?: string;
  onChange: (companyId: string) => void;
};

/** Only active companies may be assigned to a shipment. */
function ShipmentCompanySelect({ value, onChange }: ShipmentCompanySelectProps) {
  const { data } = useShippingCompanies({
    page: 1,
    limit: 100,
    status: "active",
  });

  const options = (data?.data ?? []).map((company) => ({
    label: company.name,
    value: company.id,
  }));

  return (
    <FormSelect
      value={value}
      options={options}
      placeholder="اختر شركة الشحن"
      onChange={onChange}
    />
  );
}

export default ShipmentCompanySelect;
