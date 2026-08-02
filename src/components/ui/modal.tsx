"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib";
import { ScrollArea } from "./scroll-area";
import { TOAST_SUCCESS_EVENT } from "@/lib/toast-events";

interface IProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  closeButtonClassname?: string;
}

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  contentClassName,
  titleClassName,
  descriptionClassName,
  closeButtonClassname,
}: IProps) {
  useEffect(() => {
    if (!open) return;

    const closeModal = () => onClose();

    window.addEventListener(TOAST_SUCCESS_EVENT, closeModal);
    return () => window.removeEventListener(TOAST_SUCCESS_EVENT, closeModal);
  }, [onClose, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn("bg-background", contentClassName)}
        showCloseButton={false}
        dir="rtl"
      >
        {/* <ScrollArea className="min-h-full overflow-y-auto"> */}
        {title && (
          <DialogHeader>
            <CloseButtonModal closeButtonClassname={closeButtonClassname} />
            <DialogTitle className={cn("text-right", titleClassName)}>
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription
                className={cn("text-right", descriptionClassName)}
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <ScrollArea className="**:data-[slot=scroll-area-viewport]:max-h-[85svh] **:data-[slot=scroll-area-viewport]:overflow-y-auto **:data-[slot=scroll-area-scrollbar]:left-0 **:data-[slot=scroll-area-scrollbar]:right-auto">
          <div dir="rtl">{children}</div>
        </ScrollArea>
        {footer && <DialogFooter>{footer}</DialogFooter>}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
interface ICloseButtonProps {
  closeButtonClassname?: string;
}
export function CloseButtonModal({ closeButtonClassname }: ICloseButtonProps) {
  return (
    <DialogClose
      className={cn(
        "w-6 h-6 rounded-full border-2 flex justify-center items-center absolute left-4 top-4 border-primary bg-background text-primary",
        closeButtonClassname && closeButtonClassname,
      )}
    >
      <X className="size-4 shrink-0" />
    </DialogClose>
  );
}
