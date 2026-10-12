"use client";

import { CircleCheckBig, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DASHBOARD_SUCCESS_EVENT,
  showSuccessModal,
} from "@/lib/success-feedback";

export { showSuccessModal };

type SuccessEvent = CustomEvent<string>;

export default function SuccessModalHost() {
  const [messages, setMessages] = useState<string[]>([]);
  const message = messages[0];

  useEffect(() => {
    function handleSuccess(event: Event) {
      const nextMessage = (event as SuccessEvent).detail;
      if (nextMessage) setMessages((current) => [...current, nextMessage]);
    }

    window.addEventListener(DASHBOARD_SUCCESS_EVENT, handleSuccess);
    return () =>
      window.removeEventListener(DASHBOARD_SUCCESS_EVENT, handleSuccess);
  }, []);

  function close() {
    setMessages((current) => current.slice(1));
  }

  return (
    <Dialog
      open={Boolean(message)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="max-w-[420px] gap-0 overflow-hidden rounded-[28px] border border-primary/25 bg-surface p-0 shadow-[0_24px_80px_-20px_rgba(26,26,26,0.35)]"
      >
        <div className="relative flex min-h-44 items-center justify-center overflow-hidden bg-linear-to-br from-primary via-[#f7c51f] to-[#e8ad00] px-6 py-8">
          <div className="absolute -right-12 -top-16 size-40 rounded-full bg-secondary/6" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-white/20" />
          <Sparkles
            className="absolute right-8 top-7 size-5 text-secondary/55"
            aria-hidden="true"
          />
          <div className="relative flex size-24 items-center justify-center rounded-full bg-white/30 ring-1 ring-secondary/15 backdrop-blur-sm">
            <div className="flex size-19 items-center justify-center rounded-full bg-secondary text-primary shadow-lg shadow-secondary/20">
              <CircleCheckBig
                className="size-11"
                strokeWidth={2.25}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div className="bg-surface px-7 pb-7 pt-6 text-center">
          <DialogHeader className="items-center gap-3 text-center sm:text-center">
            <DialogTitle className="text-xl font-bold leading-8 text-secondary">
              تمت العملية بنجاح
            </DialogTitle>
            <DialogDescription
              className="max-w-sm text-center text-[15px] leading-7 text-text-muted"
              role="status"
            >
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              type="button"
              className="h-12 w-full rounded-2xl bg-secondary text-base font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90 active:scale-[0.99]"
              onClick={close}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
