import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type AppVersionFormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onClose: () => void;
};

function AppVersionFormActions({
  submitLabel,
  isSubmitting,
  isSubmitDisabled = false,
  onClose,
}: AppVersionFormActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Button
        type="submit"
        disabled={isSubmitting || isSubmitDisabled}
        className="h-14 rounded-[14px] bg-primary px-6 text-base font-medium text-secondary hover:bg-primary/90"
      >
        {isSubmitting ? <Loader /> : submitLabel}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={isSubmitting}
        className="h-14 rounded-[14px] bg-neutral-100 px-6 text-base font-medium text-dark-gray hover:bg-neutral-200"
      >
        إلغاء
      </Button>
    </div>
  );
}

export default AppVersionFormActions;
