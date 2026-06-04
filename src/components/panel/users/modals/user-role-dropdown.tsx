"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { AddUserFormValues } from "@/schemas/users";
import { roleLabels } from "../results/user-result-parts";
import { userRoles } from "@/schemas/users";

const roleOptions = userRoles.map((role) => ({ label: roleLabels[role], value: role }));

function UserRoleDropdown({
  value,
  setValue,
}: {
  value: AddUserFormValues["role"];
  setValue: UseFormSetValue<AddUserFormValues>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel = roleOptions.find((o) => o.value === value)?.label ?? "اختر الدور";

  return (
    <div ref={containerRef} className="relative h-14 w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
          !value && "text-[#99a1af]",
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={cn("size-5 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setValue("role", option.value, { shouldDirty: true, shouldValidate: true });
                setIsOpen(false);
              }}
              className={cn(
                "flex h-11 w-full items-center justify-start px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default UserRoleDropdown;
