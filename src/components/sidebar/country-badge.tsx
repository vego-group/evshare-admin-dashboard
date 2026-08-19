import Image from "next/image";
import { phoneCountries } from "@/data";
import type { CountryCode } from "@/types";

export default function CountryBadge({ country }: { country: CountryCode }) {
  const selected = phoneCountries[country];

  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900" title="الدولة التي تدير بياناتها الآن">
      <Image
        src={selected.flag}
        alt={`علم ${selected.name_ar}`}
        width={24}
        height={16}
        className="h-4 w-6 rounded-[3px] object-cover shadow-sm"
      />
      <span>{selected.name_ar}</span>
    </div>
  );
}
