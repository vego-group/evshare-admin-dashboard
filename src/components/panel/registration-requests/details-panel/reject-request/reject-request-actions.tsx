import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type RejectRequestActionsProps = {
  disabled: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function RejectRequestActions({
  disabled,
  loading,
  onCancel,
  onConfirm,
}: RejectRequestActionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={loading}
        className="h-12 rounded-[14px] bg-muted px-4 text-base font-medium leading-6 text-secondary hover:bg-muted/80"
      >
        إلغاء
      </Button>
      <Button
        type="button"
        disabled={disabled}
        onClick={onConfirm}
        className="h-12 rounded-[14px] bg-danger px-4 text-base font-medium leading-6 text-white hover:bg-[#c90009] disabled:opacity-50"
      >
        {loading ? <Loader /> : null}
        تأكيد الرفض
      </Button>
    </div>
  );
}

export default RejectRequestActions;
