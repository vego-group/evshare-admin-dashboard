"use client";

import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./sheet";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib";
import { TOAST_SUCCESS_EVENT } from "@/lib/toast-events";

interface IProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  closeButtonClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  hideDefaultCloseButton?: boolean;
}

function Panel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  headerClassName,
  footerClassName,
  contentClassName = "sm:max-w-xs",
  titleClassName,
  descriptionClassName,
  closeButtonClassName,
  side = "right",
  hideDefaultCloseButton = true,
}: IProps) {
  useEffect(() => {
    if (!open) return;

    const closePanel = () => onClose();

    window.addEventListener(TOAST_SUCCESS_EVENT, closePanel);
    return () => window.removeEventListener(TOAST_SUCCESS_EVENT, closePanel);
  }, [onClose, open]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className={contentClassName}
        side={side}
        showCloseButton={!hideDefaultCloseButton}
      >
        {title && (
          <SheetHeader {...(headerClassName && { className: headerClassName })}>
            <CloseButtonPanel closeButtonClassname={closeButtonClassName} />
            <SheetTitle {...(titleClassName && { className: titleClassName })}>
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription
                {...(descriptionClassName && {
                  className: descriptionClassName,
                })}
              >
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}
        {children}
        {footer && (
          <SheetFooter {...(footerClassName && { className: footerClassName })}>
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default Panel;
interface ICloseButtonProps {
  closeButtonClassname?: string;
}
export function CloseButtonPanel({ closeButtonClassname }: ICloseButtonProps) {
  return (
    <SheetClose
      className={cn(
        "w-6 h-6 left-4 bg-transparent rounded-full text-gray-700 border-2 border-gray-700 flex justify-center items-center absolute top-4",
        closeButtonClassname && closeButtonClassname,
      )}
    >
      <X className="size-4 shrink-0" />
    </SheetClose>
  );
}
