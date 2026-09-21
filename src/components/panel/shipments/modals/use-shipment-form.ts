import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { ShipmentFormValues } from "@/schemas/shipments";
import { addShipmentForOrder, editShipment } from "@/services/mutations";
import type { ShipmentListItem } from "@/types";
import { useCurrency } from "@/provider/currency";

import {
  shipmentAddResolver,
  getShipmentDefaultValues,
  shipmentEditResolver,
} from "./shipment-form-utils";
import {
  buildAddShipmentPayload,
  buildChangedShipmentPayload,
  hasPayloadEntries,
  shipmentToFormValues,
} from "./shipment-payload-utils";

type Options = {
  open: boolean;
  shipment?: ShipmentListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useShipmentForm({ open, shipment, onClose, onSaved }: Options) {
  const { countryCode, currencyCode } = useCurrency();
  const isEdit = Boolean(shipment);
  const defaultValues = useMemo(() => getShipmentDefaultValues(currencyCode), [currencyCode]);

  const form = useForm<ShipmentFormValues>({
    resolver: isEdit ? shipmentEditResolver(countryCode, shipment?.driver?.phone) : shipmentAddResolver(countryCode),
    defaultValues,
    mode: "onChange",
  });

  const orderUuid = useWatch({ control: form.control, name: "order_uuid" });
  const companyUuid = useWatch({
    control: form.control,
    name: "shipping_company_uuid",
  });
  const pickingType = useWatch({ control: form.control, name: "picking_type" });
  const pickupDate = useWatch({
    control: form.control,
    name: "estimated_pickup_date",
  });
  const deliveryDate = useWatch({
    control: form.control,
    name: "estimated_delivery_date",
  });
  const senderCity = useWatch({ control: form.control, name: "sender_city_uuid" });
  const recipientCity = useWatch({ control: form.control, name: "recipient_city_uuid" });

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      return;
    }
    form.reset(
      shipment ? shipmentToFormValues(shipment, currencyCode) : defaultValues,
    );
  }, [currencyCode, defaultValues, form, open, shipment]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: ShipmentFormValues) => {
    let result;

    if (shipment) {
      const payload = buildChangedShipmentPayload(
        values,
        form.formState.dirtyFields,
        countryCode,
      );
      if (!hasPayloadEntries(payload)) {
        close();
        return;
      }
      result = await editShipment(shipment.id, payload);
    } else {
      if (!values.order_uuid) return;
      result = await addShipmentForOrder(
        values.order_uuid,
        buildAddShipmentPayload(values),
      );
    }

    if (!result.ok) {
      toast.error(result.message || "فشل حفظ الشحنة");
      return;
    }

    toast.success(result.message || "تم حفظ الشحنة بنجاح");
    form.reset(defaultValues);
    onClose();
    await onSaved();
  };

  return {
    form,
    isEdit,
    orderUuid,
    companyUuid,
    pickingType,
    pickupDate,
    deliveryDate,
    senderCity,
    recipientCity,
    close,
    onSubmit,
  };
}
