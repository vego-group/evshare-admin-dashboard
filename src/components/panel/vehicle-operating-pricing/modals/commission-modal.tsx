"use client";

import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import {
  commissionSchema,
  type CommissionValues,
} from "@/schemas/vehicle-operating-pricing";
import { updateOperationCompanyCommissionAPI } from "@/services/mutations";
import type { VehicleListItem } from "@/types";

type Props = {
  vehicle: VehicleListItem | null;
  isSaving: boolean;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setIsSaving: (value: boolean) => void;
};

function CommissionModal({ vehicle, isSaving, open, onClose, onSaved, setIsSaving }: Props) {
  const company = vehicle?.operation_company;
  const currentPercentage = company?.pricing_percentage ?? company?.commission_percentage ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CommissionValues>({
    resolver: commissionResolver,
    defaultValues: {
      commission_percentage: Number(currentPercentage || 0),
    },
    mode: "onChange",
  });

  async function submit(values: CommissionValues) {
    if (!company || isSaving || !isDirty) return;
    setIsSaving(true);
    const result = await updateOperationCompanyCommissionAPI(company.id, values);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم تحديث العمولة");
      await onSaved();
      onClose();
      return;
    }
    toast.error(result?.message || "فشل تحديث العمولة");
  }

  if (!company) return null;
  return (
    <Modal open={open} onClose={onClose} title={`عمولة ${company.name}`} contentClassName="max-w-md">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 p-1">
        <label className="block">
          <span className="mb-2 block text-sm text-dark-gray">العمولة الحالية</span>
          <input
            type="number"
            min="0"
            step="0.01"
            onKeyDown={preventNegativeNumberInput}
            onPaste={(event) =>
              preventNegativeNumberPaste(event, { allowDecimal: true })
            }
            className="h-12 w-full rounded-[12px] border border-primary bg-primary/4 px-3 text-left outline-none"
            dir="ltr"
            {...register("commission_percentage", { valueAsNumber: true })}
          />
          <InputErrorMessage msg={errors.commission_percentage?.message} />
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>إلغاء</Button>
          <Button type="submit" disabled={isSaving || !isDirty} className="min-w-17 bg-primary text-secondary hover:bg-primary/90">
            {isSaving ? <Loader borderColor="#1f2937" /> : "حفظ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const commissionResolver: Resolver<CommissionValues> = async (values) => {
  const result = commissionSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<CommissionValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CommissionValues;
    if (!errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export default CommissionModal;
