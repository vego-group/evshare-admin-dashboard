import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { ShippingCityFormValues } from "@/schemas/shipping-cities";
import { addShippingCity, editShippingCity } from "@/services/mutations";
import type { ShippingCityListItem } from "@/types";

import {
  buildAddShippingCityPayload,
  buildChangedShippingCityPayload,
  hasPayloadEntries,
  shippingCityDefaultValues,
  shippingCityFormResolver,
  shippingCityToFormValues,
} from "./shipping-city-form-utils";

type Options = {
  open: boolean;
  shippingCity?: ShippingCityListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useShippingCityForm({
  open,
  shippingCity,
  onClose,
  onSaved,
}: Options) {
  const form = useForm<ShippingCityFormValues>({
    resolver: shippingCityFormResolver,
    defaultValues: shippingCityDefaultValues,
    mode: "onChange",
  });

  const cityUuid = useWatch({ control: form.control, name: "city_uuid" });
  const courierDelivery = useWatch({
    control: form.control,
    name: "courier_delivery",
  });
  const bulletDelivery = useWatch({
    control: form.control,
    name: "bullet_delivery",
  });
  const branchCoverage = useWatch({
    control: form.control,
    name: "branch_coverage",
  });
  const active = useWatch({ control: form.control, name: "active" });

  useEffect(() => {
    if (!open) {
      form.reset(shippingCityDefaultValues);
      return;
    }
    form.reset(
      shippingCity
        ? shippingCityToFormValues(shippingCity)
        : shippingCityDefaultValues,
    );
  }, [form, open, shippingCity]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(shippingCityDefaultValues);
    onClose();
  };

  const onSubmit = async (values: ShippingCityFormValues) => {
    let result;

    if (shippingCity) {
      const payload = buildChangedShippingCityPayload(
        values,
        form.formState.dirtyFields,
      );
      if (!hasPayloadEntries(payload)) {
        close();
        return;
      }
      result = await editShippingCity(shippingCity.id, payload);
    } else {
      result = await addShippingCity(buildAddShippingCityPayload(values));
    }

    if (!result.ok) {
      toast.error(result.message || "فشل حفظ مدينة الشحن");
      return;
    }

    toast.success(result.message || "تم حفظ مدينة الشحن بنجاح");
    form.reset(shippingCityDefaultValues);
    onClose();
    await onSaved();
  };

  return {
    form,
    cityUuid,
    courierDelivery,
    bulletDelivery,
    branchCoverage,
    active,
    close,
    onSubmit,
  };
}
