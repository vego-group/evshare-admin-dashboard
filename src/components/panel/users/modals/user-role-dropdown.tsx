"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { useRoles } from "@/hooks/api";
import { cn } from "@/lib/utils";
import type { AddUserFormValues } from "@/schemas/users";

function UserRoleDropdown({
  value,
  setValue,
}: {
  value: AddUserFormValues["role"];
  setValue: UseFormSetValue<AddUserFormValues>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useRoles({ page: 1, limit: 100 });
  const roles = data?.data ?? [];

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
        <span>{value || "اختر الدور"}</span>
        <ChevronDown className={cn("size-5 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-gray">جار التحميل...</p>
            ) : roles.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray">لا توجد أدوار</p>
            ) : (
              roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setValue("role", role.name, { shouldDirty: true, shouldValidate: true });
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center justify-start px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    value === role.name && "bg-primary/15 text-secondary",
                  )}
                >
                  {role.name}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserRoleDropdown;
