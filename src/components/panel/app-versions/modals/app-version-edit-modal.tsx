"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import { useLatestAppVersionValues } from "@/hooks/api/app-versions";
import type { AppVersionFormValues } from "@/schemas/app-versions";
import { editAppVersion } from "@/services/mutations";
import type { AppVersionDetail, AppVersionPlatform } from "@/types";

import AppVersionFormActions from "./app-version-form-actions";
import AppVersionFormFields from "./app-version-form-fields";
import {
  appVersionDefaultValues,
  buildChangedAppVersionPayload,
  createAppVersionFormResolver,
  getLatestValuesKey,
  hasPayloadEntries,
} from "./app-version-form-utils";

type AppVersionEditModalProps = {
  open: boolean;
  appVersion?: AppVersionDetail;
  isLoading?: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function AppVersionEditModal({
  open,
  appVersion,
  isLoading = false,
  onClose,
  onSaved,
}: AppVersionEditModalProps) {
  const androidMerchantLatestValuesQuery = useLatestAppVersionValues(
    "android",
    "merchant",
    open,
  );
  const androidDriverLatestValuesQuery = useLatestAppVersionValues(
    "android",
    "driver",
    open,
  );
  const iosMerchantLatestValuesQuery = useLatestAppVersionValues(
    "ios",
    "merchant",
    open,
  );
  const iosDriverLatestValuesQuery = useLatestAppVersionValues(
    "ios",
    "driver",
    open,
  );
  const form = useForm<AppVersionFormValues>({
    resolver: createAppVersionFormResolver({
      latestValuesByTarget: {
        [getLatestValuesKey("android", "merchant")]:
          androidMerchantLatestValuesQuery.data?.data,
        [getLatestValuesKey("android", "driver")]:
          androidDriverLatestValuesQuery.data?.data,
        [getLatestValuesKey("ios", "merchant")]:
          iosMerchantLatestValuesQuery.data?.data,
        [getLatestValuesKey("ios", "driver")]:
          iosDriverLatestValuesQuery.data?.data,
      },
      currentIdentity: appVersion ? toFormValues(appVersion) : null,
    }),
    defaultValues: appVersionDefaultValues,
    mode: "onChange",
  });
  const type = useWatch({ control: form.control, name: "type" });
  const platform = useWatch({ control: form.control, name: "platform" });
  const version = useWatch({ control: form.control, name: "version" });
  const versionCode = useWatch({ control: form.control, name: "version_code" });
  const status = useWatch({ control: form.control, name: "status" });
  const isCritical = useWatch({ control: form.control, name: "is_critical" });
  const latestValuesQuery = getLatestValuesQuery(type, platform, {
    androidMerchant: androidMerchantLatestValuesQuery,
    androidDriver: androidDriverLatestValuesQuery,
    iosMerchant: iosMerchantLatestValuesQuery,
    iosDriver: iosDriverLatestValuesQuery,
  });
  const latestValues = latestValuesQuery.data?.data;
  const isLatestValuesLoading = latestValuesQuery.isLoading;
  const shouldValidateAgainstLatest = Boolean(
    form.formState.dirtyFields.type ||
      form.formState.dirtyFields.platform ||
      form.formState.dirtyFields.version ||
      form.formState.dirtyFields.version_code,
  );

  useEffect(() => {
    if (!open) {
      form.reset(appVersionDefaultValues);
      return;
    }
    if (appVersion) form.reset(toFormValues(appVersion));
  }, [appVersion, open, form]);

  useEffect(() => {
    if (open && latestValues && shouldValidateAgainstLatest) {
      const targetChanged = Boolean(
        form.formState.dirtyFields.type || form.formState.dirtyFields.platform,
      );
      const fieldsToValidate: Array<"version" | "version_code"> = [];
      if ((targetChanged || form.formState.dirtyFields.version) && version?.trim()) {
        fieldsToValidate.push("version");
      }
      if (
        (targetChanged || form.formState.dirtyFields.version_code) &&
        Number.isFinite(versionCode)
      ) {
        fieldsToValidate.push("version_code");
      }
      if (fieldsToValidate.length > 0) void form.trigger(fieldsToValidate);
    }
  }, [
    form,
    latestValues,
    open,
    platform,
    shouldValidateAgainstLatest,
    type,
    version,
    versionCode,
  ]);

  const onSubmit = async (values: AppVersionFormValues) => {
    if (!appVersion || !form.formState.isDirty) return;
    const payload = buildChangedAppVersionPayload(values, form.formState.dirtyFields);
    if (!hasPayloadEntries(payload)) return;
    const result = await editAppVersion(appVersion.id, payload);

    if (result?.ok) {
      toast.success(result.message || "تم تعديل الإصدار بنجاح");
      await onSaved();
      onClose();
      return;
    }

    toast.error(result?.message || "فشل تعديل الإصدار");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[760px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تعديل إصدار التطبيق"
      description="تعديل بيانات الإصدار المحدد"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        {isLoading ? (
          <FormShimmer />
        ) : (
          <>
            <AppVersionFormFields
              type={type}
              platform={platform}
              status={status}
              isCritical={isCritical}
              errors={form.formState.errors}
              register={form.register}
              setValue={form.setValue}
            />
            <AppVersionFormActions
              submitLabel="حفظ التعديلات"
              isSubmitting={form.formState.isSubmitting}
              isSubmitDisabled={
                !form.formState.isDirty ||
                (shouldValidateAgainstLatest && isLatestValuesLoading)
              }
              onClose={onClose}
            />
          </>
        )}
      </form>
    </Modal>
  );
}

function toFormValues(appVersion: AppVersionDetail): AppVersionFormValues {
  return {
    type: appVersion.type,
    platform: appVersion.platform as AppVersionPlatform,
    version: appVersion.version,
    version_code: appVersion.version_code,
    is_critical: appVersion.is_critical,
    status: appVersion.status,
    release_notes_en: appVersion.release_notes?.en ?? "",
    release_notes_ar: appVersion.release_notes?.ar ?? "",
  };
}

function FormShimmer() {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Shimmer className="h-5 w-32 rounded-md" />
          <Shimmer className="h-14 w-full rounded-[14px]" />
        </div>
      ))}
    </div>
  );
}

export default AppVersionEditModal;

function getLatestValuesQuery(
  type: AppVersionFormValues["type"],
  platform: AppVersionFormValues["platform"],
  queries: {
    androidMerchant: ReturnType<typeof useLatestAppVersionValues>;
    androidDriver: ReturnType<typeof useLatestAppVersionValues>;
    iosMerchant: ReturnType<typeof useLatestAppVersionValues>;
    iosDriver: ReturnType<typeof useLatestAppVersionValues>;
  },
) {
  if (platform === "ios") {
    return type === "driver" ? queries.iosDriver : queries.iosMerchant;
  }

  return type === "driver" ? queries.androidDriver : queries.androidMerchant;
}
