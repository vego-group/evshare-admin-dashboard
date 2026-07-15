import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { KYC_DEFAULT_STATUS_KEY } from "@/types";
import type { SettingFormValues } from "@/schemas/settings";

import { isRichTextSetting } from "../../utils";
import SettingField from "./field";
import KycDefaultStatusDropdown from "./kyc-default-status-dropdown";

type Props = {
  settingName: string;
  value: string;
  errors: FieldErrors<SettingFormValues>;
  register: UseFormRegister<SettingFormValues>;
  setValue: UseFormSetValue<SettingFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-dark-gray outline-none transition placeholder:text-gray/70 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-gray";

function SettingFormFields({
  settingName,
  value,
  errors,
  register,
  setValue,
}: Props) {
  const isKycDefaultStatus = settingName === KYC_DEFAULT_STATUS_KEY;
  const isRichText = isRichTextSetting(settingName);

  return (
    <div className="flex flex-col gap-4">
      <SettingField label="القيمة" error={errors.value?.message}>
        {isKycDefaultStatus ? (
          <KycDefaultStatusDropdown value={value} setValue={setValue} />
        ) : isRichText ? (
          <RichTextEditor
            dir="rtl"
            value={value}
            onChange={(next) =>
              setValue("value", next, { shouldDirty: true, shouldValidate: true })
            }
          />
        ) : (
          <input
            dir="ltr"
            className={inputClass}
            onKeyDown={preventNegativeNumberInput}
            onPaste={(event) =>
              preventNegativeNumberPaste(event, { allowDecimal: true })
            }
            {...register("value")}
          />
        )}
      </SettingField>
    </div>
  );
}

export default SettingFormFields;
