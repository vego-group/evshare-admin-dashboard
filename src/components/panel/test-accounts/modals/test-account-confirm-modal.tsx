import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type Variant = "enable" | "disable" | "delete";

type TestAccountConfirmModalProps = {
  open: boolean;
  variant: Variant;
  userName?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const copy: Record<
  Variant,
  { icon: string; title: (name: string) => string; description: string; confirmLabel: string }
> = {
  enable: {
    icon: "!",
    title: (name) => `هل تريد تفعيل حساب الاختبار الخاص بـ ${name}؟`,
    description: "سيتم إعادة تفعيل أسعار الاختبار لهذا المستخدم عند الدفع.",
    confirmLabel: "تفعيل",
  },
  disable: {
    icon: "!",
    title: (name) => `هل تريد تعطيل حساب الاختبار الخاص بـ ${name}؟`,
    description: "سيتم إيقاف أسعار الاختبار وسيُحاسب هذا المستخدم بالأسعار الفعلية.",
    confirmLabel: "تعطيل",
  },
  delete: {
    icon: "!",
    title: (name) => `هل أنت متأكد أنك تريد حذف حساب الاختبار الخاص بـ ${name}؟`,
    description: "سيتم حذف حساب الاختبار هذا. لن يؤثر هذا على المستخدم نفسه أو طلباته السابقة.",
    confirmLabel: "حذف",
  },
};

function TestAccountConfirmModal({
  open,
  variant,
  userName,
  isSubmitting,
  onClose,
  onConfirm,
}: TestAccountConfirmModalProps) {
  const { title, description, confirmLabel } = copy[variant];
  const isDestructive = variant === "delete";

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-[481px] flex-col items-center justify-center gap-6 text-center">
        <div
          className={cn(
            "grid size-24 place-items-center rounded-full",
            isDestructive ? "bg-red-50 text-red-500" : "bg-primary/15 text-secondary",
          )}
        >
          <span className="text-5xl leading-none">!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            {title(userName ?? "")}
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">{description}</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-[54px] rounded-[14px] bg-neutral-100 px-4 py-3 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={cn(
              "h-[54px] rounded-[14px] px-4 py-3 text-base font-medium shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
              isDestructive
                ? "bg-[#f04438] text-white hover:bg-[#d92d20]"
                : "bg-primary text-secondary hover:bg-primary/90",
            )}
          >
            {isSubmitting ? <Loader /> : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default TestAccountConfirmModal;
