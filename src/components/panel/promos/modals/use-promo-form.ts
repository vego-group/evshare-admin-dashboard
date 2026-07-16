import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { PromoFormValues } from "@/schemas/promos";
import { addPromo, editPromo } from "@/services/mutations";
import type { PromoListItem } from "@/types";

import {
  buildAddPromoPayload,
  buildChangedPromoPayload,
  hasPayloadEntries,
  promoDefaultValues,
  promoFormResolver,
  promoToFormValues,
} from "./promo-form-utils";

type Options = {
  open: boolean;
  promo?: PromoListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function usePromoForm({ open, promo, onClose, onSaved }: Options) {
  const form = useForm<PromoFormValues>({
    resolver: promoFormResolver,
    defaultValues: promoDefaultValues,
    mode: "onChange",
  });

  const type = useWatch({ control: form.control, name: "type" });
  const discountType = useWatch({ control: form.control, name: "discount_type" });
  const isActive = useWatch({ control: form.control, name: "is_active" });
  const startDate = useWatch({ control: form.control, name: "start_date" });
  const endDate = useWatch({ control: form.control, name: "end_date" });

  useEffect(() => {
    if (!open) {
      form.reset(promoDefaultValues);
      return;
    }
    form.reset(promo ? promoToFormValues(promo) : promoDefaultValues);
  }, [form, open, promo]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(promoDefaultValues);
    onClose();
  };

  const onSubmit = async (values: PromoFormValues) => {
    const result = promo
      ? await (() => {
          const payload = buildChangedPromoPayload(values, form.formState.dirtyFields);
          if (!hasPayloadEntries(payload)) return undefined;
          return editPromo(promo.id, payload);
        })()
      : await addPromo(buildAddPromoPayload(values));

    if (!result) {
      close();
      return;
    }

    if (!result.ok) {
      toast.error(result.message || "فشل حفظ كود الخصم");
      return;
    }

    toast.success(result.message || "تم حفظ كود الخصم بنجاح");
    form.reset(promoDefaultValues);
    onClose();
    await onSaved();
  };

  return { form, type, discountType, isActive, startDate, endDate, close, onSubmit };
}
