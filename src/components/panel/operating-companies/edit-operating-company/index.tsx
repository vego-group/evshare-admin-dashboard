"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/components/ui/header";
import OperatingCompanyFormFields, {
  OperatingCompanyFormShimmer,
} from "../modals/operating-company-form-fields";
import { OperatingCompanyFormActions } from "../modals/operating-company-form-modal-parts";
import { useEditOperatingCompanyForm } from "./use-edit-operating-company-form";

function EditOperatingCompany() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    isLoading,
    previewUrl,
    handleLogoChange,
    handleCancel,
    onSubmit,
  } = useEditOperatingCompanyForm();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/operating-companies")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة إلى الشركات المشغلة"
        >
          <ArrowRight className="size-5 shrink-0" />
        </button>
        <Header title="تعديل الشركة المشغلة" subtitle="قم بتعديل بيانات الشركة" />
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 text-right"
        >
          {isLoading ? (
            <OperatingCompanyFormShimmer />
          ) : (
            <>
              <OperatingCompanyFormFields
                errors={errors}
                logoPreviewUrl={previewUrl}
                onLogoChange={handleLogoChange}
                register={register}
                control={control}
              />
              <OperatingCompanyFormActions
                submitLabel="حفظ التعديلات"
                isSubmitting={isSubmitting}
                isSubmitDisabled={!isDirty}
                onClose={handleCancel}
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditOperatingCompany;
