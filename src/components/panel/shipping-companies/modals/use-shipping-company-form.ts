import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { ShippingCompanyFormValues } from "@/schemas/shipping-companies";
import { addShippingCompany, editShippingCompany } from "@/services/mutations";
import type { ShippingCompanyListItem } from "@/types";

import {
  buildAddShippingCompanyPayload,
  buildChangedShippingCompanyPayload,
  hasPayloadEntries,
  shippingCompanyDefaultValues,
  shippingCompanyFormResolver,
  shippingCompanyToFormValues,
} from "./shipping-company-form-utils";

type Options = {
  open: boolean;
  company?: ShippingCompanyListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useShippingCompanyForm({
  open,
  company,
  onClose,
  onSaved,
}: Options) {
  const form = useForm<ShippingCompanyFormValues>({
    resolver: shippingCompanyFormResolver,
    defaultValues: shippingCompanyDefaultValues,
    mode: "onChange",
  });

  const serviceType = useWatch({ control: form.control, name: "service_type" });
  const deliveryType = useWatch({
    control: form.control,
    name: "delivery_type",
  });
  const supportsCod = useWatch({ control: form.control, name: "supports_cod" });
  const active = useWatch({ control: form.control, name: "active" });

  useEffect(() => {
    if (!open) {
      form.reset(shippingCompanyDefaultValues);
      return;
    }
    form.reset(
      company
        ? shippingCompanyToFormValues(company)
        : shippingCompanyDefaultValues,
    );
  }, [company, form, open]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(shippingCompanyDefaultValues);
    onClose();
  };

  const onSubmit = async (values: ShippingCompanyFormValues) => {
    let result;

    if (company) {
      const payload = buildChangedShippingCompanyPayload(
        values,
        form.formState.dirtyFields,
      );
      if (!hasPayloadEntries(payload)) {
        close();
        return;
      }
      result = await editShippingCompany(company.id, payload);
    } else {
      result = await addShippingCompany(buildAddShippingCompanyPayload(values));
    }

    if (!result.ok) {
      toast.error(result.message || "فشل حفظ شركة الشحن");
      return;
    }

    toast.success(result.message || "تم حفظ شركة الشحن بنجاح");
    form.reset(shippingCompanyDefaultValues);
    onClose();
    await onSaved();
  };

  return { form, serviceType, deliveryType, supportsCod, active, close, onSubmit };
}
