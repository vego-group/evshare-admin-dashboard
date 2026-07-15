"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import type { OrderNewStatus } from "@/types";

const STATUS_OPTIONS: { label: string; value: OrderNewStatus }[] = [
  { label: "مسودة", value: "draft" },
  { label: "قيد الانتظار", value: "pending" },
  { label: "قيد التحضير", value: "preparing" },
  { label: "جاهز", value: "ready" },
  { label: "تم التسليم", value: "delivered" },
  { label: "مكتمل", value: "completed" },
  { label: "ملغي", value: "cancelled" },
];

const STATUS_STYLES: Record<OrderNewStatus, string> = {
  draft: "bg-gray-100 text-dark-gray",
  pending: "bg-amber-50 text-orange-500",
  preparing: "bg-orange-50 text-orange-600",
  ready: "bg-green-50 text-green-600",
  delivered: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

type DropdownPosition = { top: number; left: number; width: number };

type Props = {
  currentStatus: OrderNewStatus;
  disabled?: boolean;
  onSelect: (status: OrderNewStatus) => void;
};

function OrderStatusDropdown({ currentStatus, disabled, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 150),
      });
    };

    updatePosition();

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const currentLabel =
    STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label ?? currentStatus;

  return (
    <div
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-8.5 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition",
          STATUS_STYLES[currentStatus],
          !disabled && "cursor-pointer hover:opacity-80",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn("size-3.5 transition", open && "rotate-180")}
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              minWidth: position.width,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_10px_24px_rgba(16,24,40,0.12)]"
          >
            <div className="max-h-36 overflow-y-auto">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.value === currentStatus}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-10 w-full items-center justify-start px-4 text-right text-sm font-medium transition",
                    option.value === currentStatus
                      ? "cursor-default bg-neutral-50 text-dark-gray opacity-50"
                      : "cursor-pointer text-secondary hover:bg-primary/5",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default OrderStatusDropdown;
