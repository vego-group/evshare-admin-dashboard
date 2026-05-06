import { Button } from "@/components/ui/button";

type RejectRequestActionsProps = {
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function RejectRequestActions({
  disabled,
  onCancel,
  onConfirm,
}: RejectRequestActionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
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
        تأكيد الرفض
      </Button>
    </div>
  );
}

export default RejectRequestActions;
