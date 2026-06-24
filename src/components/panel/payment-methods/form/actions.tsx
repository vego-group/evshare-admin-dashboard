import { Button } from "@/components/ui/button";

type Props = {
  isDirty: boolean;
  isSubmitting: boolean;
  onClose: () => void;
};

function PaymentMethodActions({ isDirty, isSubmitting, onClose }: Props) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        إلغاء
      </Button>
      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
      </Button>
    </div>
  );
}

export default PaymentMethodActions;
