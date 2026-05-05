"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  consultationRequestStatuses,
  type ConsultationRequestStatus,
} from "../consultation-requests-data";

const REQUEST_STATUS_STYLES: Record<ConsultationRequestStatus, string> = {
  جديد: "bg-green-50 text-[#00a63e]",
  مغلق: "bg-gray-100 text-dark-gray",
  "تم التواصل": "bg-amber-50 text-amber-600",
};

function RequestStatusBadge({
  status,
  onChange,
}: {
  status: ConsultationRequestStatus;
  onChange?: (status: ConsultationRequestStatus) => void;
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
        aria-label="تحديث حالة طلب الاستشارة"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "inline-flex h-[38px] items-center justify-center gap-2 rounded-full px-3 text-base font-medium leading-6 transition hover:brightness-95",
          REQUEST_STATUS_STYLES[status],
          isOpen && "brightness-95",
        )}
      >
        <ChevronDown
          className={cn("size-3.5 transition", isOpen && "rotate-180")}
        />
        {status}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-max min-w-full overflow-hidden rounded-b-[14px] border border-primary bg-[#fffdf0] text-right shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {consultationRequestStatuses.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
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

export default RequestStatusBadge;
