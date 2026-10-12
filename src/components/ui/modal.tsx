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
import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib";
import { ScrollArea } from "./scroll-area";
import { DASHBOARD_CLOSE_MODALS_EVENT } from "@/lib/success-feedback";

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
  const [successDismissal, setSuccessDismissal] = useState({
    open,
    dismissed: false,
  });
  if (successDismissal.open !== open) {
    setSuccessDismissal({ open, dismissed: false });
  }
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    function closeForSuccess() {
      // Hide synchronously so the success confirmation is never stacked over
      // the action dialog. Some callers ignore onClose while their mutation is
      // still settling, so retry the parent-state synchronization next tick.
      setSuccessDismissal((current) => ({ ...current, dismissed: true }));
      onCloseRef.current();
      window.setTimeout(() => onCloseRef.current(), 0);
    }

    window.addEventListener(DASHBOARD_CLOSE_MODALS_EVENT, closeForSuccess);
    return () =>
      window.removeEventListener(DASHBOARD_CLOSE_MODALS_EVENT, closeForSuccess);
  }, [open]);

  // Radix keeps a closed dialog mounted while its exit animation runs. When a
  // success dialog is opening, that would leave the previous panel visible
  // underneath it for a short time. Unmount it immediately instead.
  if (successDismissal.dismissed) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        className={cn("max-h-[calc(100svh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-white shadow-2xl", contentClassName)}
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        dir="rtl"
      >
        {/* <ScrollArea className="min-h-full overflow-y-auto"> */}
        {title && (
          <DialogHeader className="min-w-0 border-b border-border-subtle pb-4 pl-10">
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
        <ScrollArea className="min-h-0 **:data-[slot=scroll-area-viewport]:max-h-[calc(100svh-14rem)] **:data-[slot=scroll-area-viewport]:overflow-y-auto **:data-[slot=scroll-area-scrollbar]:left-0 **:data-[slot=scroll-area-scrollbar]:right-auto">
          <div dir="rtl">{children}</div>
        </ScrollArea>
        {footer && <DialogFooter className="border-t border-border-subtle pt-4">{footer}</DialogFooter>}
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
      aria-label="إغلاق النافذة"
      title="إغلاق"
      className={cn(
        "absolute left-4 top-4 flex size-9 min-h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-subtle text-dark-gray transition-colors hover:bg-neutral-200",
        closeButtonClassname && closeButtonClassname,
      )}
    >
      <X className="size-4 min-h-4 min-w-4 shrink-0" />
    </DialogClose>
  );
}
