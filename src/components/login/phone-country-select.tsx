"use client";

import { useMemo, useState, type ElementType, type FocusEvent } from "react";
import { Check, ChevronDown, Globe2, Search } from "lucide-react";
import { getCountryCallingCode, type Country } from "react-phone-number-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type CountryOption = {
  value?: Country;
  label: string;
  divider?: boolean;
};

type PhoneCountrySelectProps = {
  value?: Country;
  options: CountryOption[];
  onChange: (country?: Country) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  iconComponent: ElementType;
  "aria-label"?: string;
};

export default function PhoneCountrySelect({
  value,
  options,
  onChange,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  iconComponent: Flag,
  "aria-label": ariaLabel,
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options.filter((option) => !option.divider);

    return options.filter((option) => {
      if (option.divider) return false;
      const callingCode = option.value
        ? getCountryCallingCode(option.value)
        : "";
      return `${option.label} ${option.value ?? ""} ${callingCode}`
        .toLocaleLowerCase()
        .includes(normalizedQuery.replace(/^\+/, ""));
    });
  }, [options, query]);

  const chooseCountry = (country?: Country) => {
    onChange(country);
    setOpen(false);
    setQuery("");
  };

  return (
    <DropdownMenu
      dir="ltr"
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel || "Select phone country"}
          disabled={disabled || readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-1.5 transition hover:bg-primary/10 focus-visible:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
            {value ? (
              <Flag country={value} label={selected?.label ?? value} />
            ) : (
              <Globe2 className="size-4 text-gray" />
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-gray transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-xl p-2"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="relative mb-2" dir="ltr">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
            placeholder="Search country or code..."
            className="h-9 w-full rounded-lg border border-[#dbe4ef] bg-neutral-50 pl-9 pr-3 text-sm text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="max-h-64 overflow-y-auto pr-1" dir="ltr">
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const callingCode = option.value
                ? getCountryCallingCode(option.value)
                : undefined;
              const isSelected = option.value === value;

              return (
                <DropdownMenuItem
                  key={option.value ?? "international"}
                  dir="ltr"
                  onSelect={() => chooseCountry(option.value)}
                  className={cn(
                    "my-0.5 grid grid-cols-[1.75rem_1fr_auto_1rem] gap-2 rounded-lg px-2 py-2",
                    isSelected && "bg-primary/10 text-secondary",
                  )}
                >
                  <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
                    {option.value ? (
                      <Flag country={option.value} label={option.label} />
                    ) : (
                      <Globe2 className="size-4 text-gray" />
                    )}
                  </span>
                  <span className="truncate font-medium">{option.label}</span>
                  <span className="text-xs tabular-nums text-gray">
                    {callingCode ? `+${callingCode}` : ""}
                  </span>
                  {isSelected && <Check className="size-4 text-emerald-600" />}
                </DropdownMenuItem>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-gray">
              No countries found
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
