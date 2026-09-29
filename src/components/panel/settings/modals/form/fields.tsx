import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { WORK_CONDITIONS_EN_KEY, type Setting } from "@/types";
import { settingDefinition } from "@/lib/settings-catalog";
import type { SettingFormValues } from "@/schemas/settings";

import { isRichTextSetting } from "../../utils";
import SettingField from "./field";
import KycDefaultStatusDropdown from "./kyc-default-status-dropdown";

type Props = {
  setting: Setting | null;
  value: string;
  errors: FieldErrors<SettingFormValues>;
  register: UseFormRegister<SettingFormValues>;
  setValue: UseFormSetValue<SettingFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-dark-gray outline-none transition placeholder:text-gray/70 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-gray";

function SettingFormFields({
  setting,
  value,
  errors,
  register,
  setValue,
}: Props) {
  const settingName = setting?.setting_name ?? "";
  const definition = setting ? settingDefinition(setting) : null;
  const isRichText = isRichTextSetting(settingName);

  return (
    <div className="flex flex-col gap-4">
      <SettingField label="القيمة" error={errors.value?.message}>
        {definition?.type === "boolean" ? (
          <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-primary/5 px-4 py-3">
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-secondary">
                {value === "1" || value === "true" ? "مفعّل" : "غير مفعّل"}
              </span>
              <span className="text-xs text-gray">
                {definition.scope === "tenant"
                  ? "يسري التغيير على هذا البلد فور حفظه."
                  : "يسري التغيير فور حفظه."}
              </span>
            </span>
            <span className="relative inline-flex shrink-0">
              <input
                type="checkbox"
                role="switch"
                className="peer sr-only"
                checked={value === "1" || value === "true"}
                onChange={(event) =>
                  setValue("value", event.target.checked ? "1" : "0", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <span className="h-7 w-12 rounded-full bg-neutral-300 transition peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-primary/30" />
              <span className="pointer-events-none absolute start-1 top-1 size-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
            </span>
          </label>
        ) : definition?.type === "enum" ? (
          settingName === "kyc_default_status" ? (
            <KycDefaultStatusDropdown value={value} setValue={setValue} />
          ) : (
            <select
              value={value}
              onChange={(event) => setValue("value", event.target.value, { shouldDirty: true, shouldValidate: true })}
              className={inputClass}
              dir="ltr"
            >
              {(definition.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          )
        ) : isRichText ? (
          <RichTextEditor
            dir={settingName === WORK_CONDITIONS_EN_KEY ? "ltr" : "rtl"}
            value={value}
            onChange={(next) =>
              setValue("value", next, { shouldDirty: true, shouldValidate: true })
            }
          />
        ) : (
          <input
            dir="ltr"
            className={inputClass}
            type={definition?.type === "email" ? "email" : "text"}
            inputMode={definition?.type === "integer" ? "numeric" : definition?.type === "decimal" || definition?.type === "csv_decimal" ? "decimal" : undefined}
            onKeyDown={definition?.type === "integer" || definition?.type === "decimal" ? (event) =>
              preventNegativeNumberInput(event, { allowDecimal: definition.type === "decimal" }) : undefined
            }
            onPaste={definition?.type === "integer" || definition?.type === "decimal" ? (event) =>
              preventNegativeNumberPaste(event, { allowDecimal: definition.type === "decimal" }) : undefined
            }
            {...register("value")}
          />
        )}
      </SettingField>
    </div>
  );
}

export default SettingFormFields;
