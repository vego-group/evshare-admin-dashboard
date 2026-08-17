import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

import SettlementFields from "./settlement-fields";
import { useVatSettlementForm } from "./use-vat-settlement-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function AddSettlementModal({ open, onClose, onSaved }: Props) {
  const { form, close, onSubmit } = useVatSettlementForm({ open, onClose, onSaved });

  return (
    <Modal
      open={open}
      onClose={close}
      title="تسجيل تسوية ضريبية"
      description="حدّد الفترة والمبلغ وتاريخ السداد لتسجيل تسوية ضريبة القيمة المضافة."
      contentClassName="rounded-2xl border-0 md:max-w-[680px]"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-1 text-right md:p-4"
      >
        <SettlementFields errors={form.formState.errors} register={form.register} />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={form.formState.isSubmitting}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader /> : "تسجيل"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSettlementModal;
