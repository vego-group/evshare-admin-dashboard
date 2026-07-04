import Modal from "@/components/ui/modal";
import type { CommissionSetting } from "@/types";

import CommissionSettingActions from "./commission-setting-actions";
import CommissionSettingFields from "./commission-setting-fields";
import { useCommissionSettingForm } from "./use-commission-setting-form";

type Props = {
  open: boolean;
  commissionSetting?: CommissionSetting | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function CommissionSettingFormModal(props: Props) {
  const { open, commissionSetting, onClose, onSaved } = props;
  const { form, type, isActive, close, onSubmit } = useCommissionSettingForm({
    open,
    commissionSetting,
    onClose,
    onSaved,
  });
  const isEdit = Boolean(commissionSetting);

  return (
    <Modal
      open={open}
      onClose={close}
      title={isEdit ? "تعديل إعداد العمولة" : "إضافة إعداد عمولة"}
      description="حدّد اسم العمولة ونوعها وقيمتها كما ستُطبّق على المعاملات."
      contentClassName="rounded-2xl border-0 md:max-w-[680px]"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-1 text-right md:p-4"
      >
        <CommissionSettingFields
          type={type}
          isActive={isActive}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <CommissionSettingActions
          isEdit={isEdit}
          isDirty={form.formState.isDirty}
          isSubmitting={form.formState.isSubmitting}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default CommissionSettingFormModal;
