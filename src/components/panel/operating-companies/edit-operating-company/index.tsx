"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import CompanyContractSection from "../company-contract-section";

import Header from "@/components/ui/header";
import InputErrorMessage from "@/components/ui/input-error-message";
import OperatingCompanyFormFields, {
  OperatingCompanyFormShimmer,
} from "../modals/operating-company-form-fields";
import { OperatingCompanyFormActions } from "../modals/operating-company-form-modal-parts";
import FormSelectDropdown, {
  type FormSelectOption,
} from "../create-operating-company/form-select-dropdown";
import { useEditOperatingCompanyForm } from "./use-edit-operating-company-form";

const statusOptions: FormSelectOption[] = [
  { label: "نشطة", value: "active" },
  { label: "غير نشطة", value: "inactive" },
];

function EditOperatingCompany() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    extraDirty,
    ownerSearch,
    setOwnerSearch,
    ownerId,
    setOwnerId,
    ownerLabel,
    setOwnerLabel,
    status,
    setStatus,
    owners,
    extraErrors,
    isLoading,
    company,
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
                hideCommission
              />
              {company?.slug !== "evshare" && <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-secondary">بحث عن المالك<input className="h-12 rounded-xl border border-neutral-200 px-4" value={ownerSearch} onChange={(event) => setOwnerSearch(event.target.value)} placeholder="اسم أو جوال" /></label>
                <label className="flex flex-col gap-2 text-sm font-medium text-secondary">المالك<select className="h-12 rounded-xl border border-neutral-200 px-4" value={ownerId} onChange={(event) => { setOwnerId(event.target.value); setOwnerLabel(event.target.selectedOptions[0]?.text ?? ""); }}><option value="">اختر المالك</option>{ownerId && !owners.some((owner) => owner.id === ownerId) && <option value={ownerId}>{ownerLabel}</option>}{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name} — {owner.mobile}</option>)}</select><InputErrorMessage msg={extraErrors.owner_id} /></label>
                <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
                  الحالة
                  <FormSelectDropdown
                    name="status"
                    label="الحالة"
                    placeholder="اختر حالة الشركة"
                    value={status}
                    options={statusOptions}
                    onChange={(option) =>
                      setStatus(option.value as "active" | "inactive")
                    }
                  />
                  <span className="text-xs leading-5 font-normal text-gray">
                    الشركة غير النشطة تُخفى من التطبيق ولا يمكن إسناد مركبات جديدة إليها.
                  </span>
                  <InputErrorMessage msg={extraErrors.status} />
                </label>
              </div>}
              <OperatingCompanyFormActions
                submitLabel="حفظ التعديلات"
                isSubmitting={isSubmitting}
                isSubmitDisabled={!isDirty && !extraDirty}
                onClose={handleCancel}
              />
            </>
          )}
        </form>
      </div>
      {!isLoading && company && <CompanyContractSection key={company.id} companyId={company.id} />}
    </div>
  );
}

export default EditOperatingCompany;
