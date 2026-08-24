"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

import { useShippingCompanies } from "@/hooks/api";
import { cn } from "@/lib/utils";

type CompanyFilterSelectProps = {
  value?: string;
  onChange: (companyId?: string) => void;
};

function CompanyFilterSelect({ value, onChange }: CompanyFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useShippingCompanies({ page: 1, limit: 100 });
  const companies = data?.data ?? [];
  const selectedCompany = companies.find((company) => company.id === value);

  const select = (companyId?: string) => {
    onChange(companyId);
    setIsOpen(false);
  };

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
      <button
        type="button"
        aria-label="شركة الشحن"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate">
            {selectedCompany?.name ?? "شركة الشحن"}
          </span>
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      )}
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="dashboard-dropdown-scroll">
            <button
              type="button"
              onClick={() => select(undefined)}
              className={cn(
                "flex min-h-10 w-full items-center justify-start px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                !value && "bg-primary/15 text-secondary",
              )}
            >
              الكل
            </button>
            {companies.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray">لا توجد شركات شحن</p>
            ) : (
              companies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => select(company.id)}
                  className={cn(
                    "flex min-h-10 w-full items-center justify-start px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    value === company.id && "bg-primary/15 text-secondary",
                  )}
                >
                  <span className="break-all">{company.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CompanyFilterSelect;
