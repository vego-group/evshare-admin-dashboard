import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {
  isEdit: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  onClose: () => void;
};

function FeatureFlagFormActions({
  isEdit,
  isDirty,
  isSubmitting,
  onClose,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Button
        type="submit"
        disabled={isSubmitting || (isEdit && !isDirty)}
        className="h-14 rounded-[14px] bg-primary text-secondary"
      >
        {isSubmitting ? (
          <Loader />
        ) : isEdit ? (
          "حفظ التعديلات"
        ) : (
          "إضافة الميزة"
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={isSubmitting}
        onClick={onClose}
        className="h-14 rounded-[14px] bg-neutral-100"
      >
        إلغاء
      </Button>
    </div>
  );
}

export default FeatureFlagFormActions;
