import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {
  isEdit: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  onClose: () => void;
};

function CommissionSettingActions({ isEdit, isDirty, isSubmitting, onClose }: Props) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        إلغاء
      </Button>
      <Button type="submit" disabled={isSubmitting || (isEdit && !isDirty)}>
        {isSubmitting ? <Loader /> : isEdit ? "حفظ التعديلات" : "إضافة"}
      </Button>
    </div>
  );
}

export default CommissionSettingActions;
