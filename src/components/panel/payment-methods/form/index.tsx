import Modal from "@/components/ui/modal";
import type { PaymentMethod } from "@/types";

import PaymentMethodActions from "./actions";
import PaymentMethodFields from "./fields";
import PaymentMethodFormShimmer from "./form-shimmer";
import { usePaymentMethodForm } from "./use-payment-method-form";

type Props = {
  open: boolean;
  paymentMethod?: PaymentMethod;
  isLoading?: boolean;
  onClose: () => void;
  onSaved: (id: string) => Promise<void> | void;
};

function PaymentMethodFormModal(props: Props) {
  const { open, paymentMethod, isLoading = false, onClose, onSaved } = props;
  const { form, isActive, allowedTypes, close, onSubmit } =
    usePaymentMethodForm({
      open,
      paymentMethod,
      onClose,
      onSaved,
    });

  return (
    <Modal
      open={open}
      onClose={close}
      title="تعديل طريقة الدفع"
      description="عدّل الاسم أو الحالة كما ستظهر للمستخدمين."
      contentClassName="rounded-2xl border-0 md:max-w-[680px]"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-1 text-right md:p-4"
      >
        {isLoading || !paymentMethod ? (
          <PaymentMethodFormShimmer />
        ) : (
          <>
            <PaymentMethodFields
              isActive={isActive}
              allowedTypes={allowedTypes ?? []}
              errors={form.formState.errors}
              register={form.register}
              setValue={form.setValue}
            />
            <PaymentMethodActions
              isDirty={form.formState.isDirty}
              isSubmitting={form.formState.isSubmitting}
              onClose={close}
            />
          </>
        )}
      </form>
    </Modal>
  );
}

export default PaymentMethodFormModal;
