"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import { useLatestAppVersionValues } from "@/hooks/api/app-versions";
import type { AppVersionFormValues } from "@/schemas/app-versions";
import { addAppVersion } from "@/services/mutations";

import AppVersionFormActions from "./app-version-form-actions";
import AppVersionFormFields from "./app-version-form-fields";
import {
  appVersionDefaultValues,
  buildAppVersionPayload,
  createAppVersionFormResolver,
  getLatestVersionCodeErrorMessage,
  getLatestVersionErrorMessage,
  getLatestValuesKey,
} from "./app-version-form-utils";

type AppVersionAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function AppVersionAddModal({
  open,
  onClose,
  onSaved,
}: AppVersionAddModalProps) {
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
  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AppVersionFormValues>({
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
    }),
    defaultValues: appVersionDefaultValues,
    mode: "onChange",
  });
  const type = useWatch({ control, name: "type" });
  const platform = useWatch({ control, name: "platform" });
  const version = useWatch({ control, name: "version" });
  const versionCode = useWatch({ control, name: "version_code" });
  const status = useWatch({ control, name: "status" });
  const isCritical = useWatch({ control, name: "is_critical" });
  const latestValuesQuery = getLatestValuesQuery(type, platform, {
    androidMerchant: androidMerchantLatestValuesQuery,
    androidDriver: androidDriverLatestValuesQuery,
    iosMerchant: iosMerchantLatestValuesQuery,
    iosDriver: iosDriverLatestValuesQuery,
  });
  const latestValues = latestValuesQuery.data?.data;
  const isLatestValuesLoading = latestValuesQuery.isLoading;
  const latestVersionError = getLatestVersionErrorMessage(
    version,
    latestValues,
  );
  const latestVersionCodeError = getLatestVersionCodeErrorMessage(
    versionCode,
    latestValues,
  );
  const hasRequiredValues =
    Boolean(type) &&
    Boolean(platform) &&
    Boolean(version?.trim()) &&
    Number.isFinite(versionCode) &&
    Boolean(status);

  useEffect(() => {
    if (!open) return;

    if (latestVersionError) {
      setError("version", { type: "latest", message: latestVersionError });
    } else if (errors.version?.type === "latest") {
      clearErrors("version");
    }

    if (latestVersionCodeError) {
      setError("version_code", {
        type: "latest",
        message: latestVersionCodeError,
      });
    } else if (errors.version_code?.type === "latest") {
      clearErrors("version_code");
    }
  }, [
    clearErrors,
    errors.version?.type,
    errors.version_code?.type,
    latestVersionCodeError,
    latestVersionError,
    open,
    setError,
  ]);

  const handleClose = () => {
    reset(appVersionDefaultValues);
    onClose();
  };

  const onSubmit = async (values: AppVersionFormValues) => {
    if (latestVersionError || latestVersionCodeError) return;

    const result = await addAppVersion(buildAppVersionPayload(values));

    if (result?.ok) {
      toast.success(result.message || "تم إضافة الإصدار بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    console.log(result);
    toast.error(result?.message || "فشل إضافة الإصدار");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[760px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة إصدار تطبيق"
      description="إضافة إصدار جديد لأحد تطبيقات الجوال"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <AppVersionFormFields
          type={type}
          platform={platform}
          status={status}
          isCritical={isCritical}
          errors={errors}
          register={register}
          setValue={setValue}
        />
        <AppVersionFormActions
          submitLabel="إضافة الإصدار"
          isSubmitting={isSubmitting}
          isSubmitDisabled={
            !hasRequiredValues ||
            isLatestValuesLoading ||
            Boolean(latestVersionError || latestVersionCodeError)
          }
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default AppVersionAddModal;

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
