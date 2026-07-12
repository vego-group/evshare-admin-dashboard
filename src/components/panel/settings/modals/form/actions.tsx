import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {
  isDirty: boolean;
  isSubmitting: boolean;
  onClose: () => void;
};

function SettingFormActions({ isDirty, isSubmitting, onClose }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="h-14 rounded-[14px] bg-primary text-secondary"
      >
        {isSubmitting ? <Loader /> : "حفظ التعديلات"}
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

export default SettingFormActions;
