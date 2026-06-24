import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import type { FeatureFlagFormValues } from "@/schemas/feature-flags";

import FeatureFlagField from "./field";
import FeatureFlagStatusToggle from "./status-toggle";

type Props = {
  isEdit: boolean;
  isActive: boolean;
  errors: FieldErrors<FeatureFlagFormValues>;
  register: UseFormRegister<FeatureFlagFormValues>;
  setValue: UseFormSetValue<FeatureFlagFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-dark-gray outline-none transition placeholder:text-gray/70 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-gray";

function FeatureFlagFormFields({
  isEdit,
  isActive,
  errors,
  register,
  setValue,
}: Props) {
  return (
    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
      <FeatureFlagField label="المفتاح" error={errors.key?.message} fullWidth>
        <input
          dir="ltr"
          disabled={isEdit}
          className={inputClass}
          placeholder="show_new_ui"
          {...register("key")}
        />
      </FeatureFlagField>
      <FeatureFlagField
        label="الاسم بالإنجليزية"
        error={errors.name_en?.message}
      >
        <input
          dir="ltr"
          className={inputClass}
          placeholder="Show New UI"
          {...register("name_en")}
        />
      </FeatureFlagField>
      <FeatureFlagField
        label="الاسم بالعربية"
        error={errors.name_ar?.message}
      >
        <input
          className={inputClass}
          placeholder="عرض التصميم الجديد"
          {...register("name_ar")}
        />
      </FeatureFlagField>
      <FeatureFlagStatusToggle
        isActive={isActive}
        onChange={(value) =>
          setValue("is_active", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
    </div>
  );
}

export default FeatureFlagFormFields;
