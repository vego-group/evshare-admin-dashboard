import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {
  isDirty: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onClose: () => void;
};

function ReceiptFormActions({ isDirty, isSubmitting, submitLabel, onClose }: Props) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        إلغاء
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="min-w-28 bg-primary text-secondary hover:bg-primary/90"
      >
        {isSubmitting ? <Loader borderColor="#1f2937" /> : submitLabel}
      </Button>
    </div>
  );
}

export default ReceiptFormActions;
