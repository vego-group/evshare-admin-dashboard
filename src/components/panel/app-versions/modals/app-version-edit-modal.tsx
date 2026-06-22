"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import type { AppVersionFormValues } from "@/schemas/app-versions";
import { editAppVersion } from "@/services/mutations";
import type { AppVersionDetail, AppVersionPlatform } from "@/types";

import AppVersionFormActions from "./app-version-form-actions";
import AppVersionFormFields from "./app-version-form-fields";
import {
  appVersionDefaultValues,
  appVersionFormResolver,
  buildChangedAppVersionPayload,
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
  const form = useForm<AppVersionFormValues>({
    resolver: appVersionFormResolver,
    defaultValues: appVersionDefaultValues,
    mode: "onChange",
  });
  const platform = useWatch({ control: form.control, name: "platform" });
  const status = useWatch({ control: form.control, name: "status" });
  const isCritical = useWatch({ control: form.control, name: "is_critical" });

  useEffect(() => {
    if (!open) {
      form.reset(appVersionDefaultValues);
      return;
    }
    if (appVersion) form.reset(toFormValues(appVersion));
  }, [appVersion, open, form]);

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
              isSubmitDisabled={!form.formState.isDirty}
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
