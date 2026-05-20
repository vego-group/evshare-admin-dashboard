import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type CategoryFormHeaderProps = {
  title: string;
  description: string;
  onClose: () => void;
};

export function CategoryFormHeader({
  title,
  description,
  onClose,
}: CategoryFormHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-medium leading-8 text-secondary">
          {title}
        </h2>
        <p className="text-sm text-gray">{description}</p>
      </div>
      <Button
        type="button"
        size="icon"
        onClick={onClose}
        className="size-12 rounded-[14px] bg-primary text-secondary hover:bg-primary/90"
      >
        <X className="size-5" />
      </Button>
    </header>
  );
}

type CategoryFormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onClose: () => void;
};

export function CategoryFormActions({
  submitLabel,
  isSubmitting,
  isSubmitDisabled = false,
  onClose,
}: CategoryFormActionsProps) {
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
