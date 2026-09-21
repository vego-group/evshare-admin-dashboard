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
      <FeatureFlagField label="الجمهور" error={errors.audience?.message}>
        <select className={inputClass} {...register("audience")}>
          <option value="all">الجميع</option>
          <option value="admin">لوحة الإدارة</option>
          <option value="rider">الراكب</option>
          <option value="merchant">التاجر</option>
          <option value="backend">الخلفية</option>
        </select>
      </FeatureFlagField>
      <FeatureFlagField label="القيمة الافتراضية">
        <label className="flex h-12 items-center gap-3 rounded-xl border border-neutral-200 px-4">
          <input type="checkbox" {...register("default_value")} />
          تُفعّل خارج نطاق الاستهداف
        </label>
      </FeatureFlagField>
      <FeatureFlagField label="المنصات" fullWidth>
        <div className="flex h-12 items-center gap-6 rounded-xl border border-neutral-200 px-4" dir="ltr">
          {(["web", "android", "ios"] as const).map((platform) => (
            <label key={platform} className="flex items-center gap-2">
              <input type="checkbox" value={platform} {...register("platforms")} /> {platform}
            </label>
          ))}
        </div>
      </FeatureFlagField>
      <FeatureFlagField label="أقل رقم بناء" error={errors.min_app_version?.message}>
        <input type="number" min={1} dir="ltr" className={inputClass} {...register("min_app_version")} />
      </FeatureFlagField>
      <FeatureFlagField label="أعلى رقم بناء" error={errors.max_app_version?.message}>
        <input type="number" min={1} dir="ltr" className={inputClass} {...register("max_app_version")} />
      </FeatureFlagField>
      <FeatureFlagField label="بداية التفعيل" error={errors.starts_at?.message}>
        <input type="datetime-local" dir="ltr" className={inputClass} {...register("starts_at")} />
      </FeatureFlagField>
      <FeatureFlagField label="نهاية التفعيل" error={errors.ends_at?.message}>
        <input type="datetime-local" dir="ltr" className={inputClass} {...register("ends_at")} />
      </FeatureFlagField>
    </div>
  );
}

export default FeatureFlagFormFields;
