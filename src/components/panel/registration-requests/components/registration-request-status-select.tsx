"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  registrationRequestStatuses,
  type RegistrationRequestStatus,
} from "./registration-requests-data";

const STATUS_STYLES: Record<RegistrationRequestStatus, string> = {
  "موافق عليها": "bg-green-50 text-green",
  مرفوضة: "bg-red-50 text-red",
  "قيد المراجعة": "bg-amber-50 text-orange-500",
};

function RegistrationRequestStatusSelect({
  status,
  onChange,
}: {
  status: RegistrationRequestStatus;
  onChange?: (status: RegistrationRequestStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="تحديث حالة طلب التسجيل"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((current) => !current);
        }}
        className={cn(
          "inline-flex h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition hover:brightness-95",
          STATUS_STYLES[status],
          isOpen && "brightness-95",
        )}
      >
        <ChevronDown
          className={cn("size-4 transition", isOpen && "rotate-180")}
        />
        {status}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-max min-w-full overflow-hidden rounded-b-[14px] border border-primary bg-bg-warm-ivory text-right shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {registrationRequestStatuses.map((option) => (
            <button
              key={option}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange?.(option);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-[50px] w-full items-center justify-start whitespace-nowrap px-4 text-base font-medium text-secondary transition hover:bg-primary/10",
                status === option && "bg-primary/10",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default RegistrationRequestStatusSelect;
