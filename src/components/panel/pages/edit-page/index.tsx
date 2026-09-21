"use client";

import Header from "@/components/ui/header";
import { getPageLabel } from "@/data/pages";

import PageFormActions from "./page-form-actions";
import PageFormFields, { PageFormShimmer } from "./page-form-fields";
import { useEditPageForm } from "./use-edit-page-form";

function EditPage() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    isLoading,
    page,
    handleCancel,
    onSubmit,
  } = useEditPageForm();

  return (
    <div className="flex w-full flex-col gap-6">
      <Header
        title={page ? `تعديل صفحة ${getPageLabel(page.slug)}` : "تعديل الصفحة"}
        subtitle="قم بتعديل عنوان ومحتوى الصفحة"
      />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 text-right"
        >
          {isLoading ? (
            <PageFormShimmer />
          ) : (
            <>
              <PageFormFields errors={errors} register={register} control={control} />
              <PageFormActions
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

export default EditPage;
