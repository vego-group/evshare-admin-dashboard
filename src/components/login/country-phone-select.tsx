"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { PhoneCountry } from "@/data";
import type { CountryCode } from "@/types";

type Props = { options: PhoneCountry[]; value: CountryCode; onChange: (value: CountryCode) => void };

export default function CountryPhoneSelect({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.code === value) ?? options[0];
  if (!selected) return null;

  return (
    <div className="relative h-full shrink-0" dir="ltr">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="flex h-full min-w-29 items-center gap-2 rounded-l-[7px] border-r border-[#dbe4ef] px-3 transition hover:bg-neutral-50">
        <Image src={selected.flag} alt="" width={24} height={16} className="h-4 w-6 rounded-[3px] object-cover shadow-sm" />
        <span dir="ltr" className="text-sm font-semibold text-secondary">+{selected.dialCode}</span>
        <ChevronDown className={`size-3.5 text-gray transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div dir="ltr" className="absolute left-0 top-[calc(100%+8px)] z-50 w-max min-w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => (
            <button key={option.code} type="button" onClick={() => { onChange(option.code); setOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right transition hover:bg-primary/10">
              <Image src={option.flag} alt="" width={28} height={19} className="h-[19px] w-7 rounded object-cover shadow-sm" />
              <span dir="rtl" className="whitespace-nowrap text-sm font-medium text-secondary">{option.name_ar}</span>
              <span dir="ltr" className="text-xs font-semibold text-gray">+{option.dialCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
