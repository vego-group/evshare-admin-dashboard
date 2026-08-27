import { Globe2 } from "lucide-react";
import type { Country } from "@/types";

type Props = { country: Country | null; onSwitch: () => void };

export default function CountryBadge({ country, onSwitch }: Props) {
  return (
    <button
      type="button"
      onClick={onSwitch}
      className="flex min-w-0 max-w-32 shrink items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-sm sm:max-w-none sm:shrink-0"
      title="تغيير الدولة يتطلب تسجيل الدخول من جديد"
    >
      <Globe2 className="size-4 shrink-0" />
      <span className="min-w-0 truncate">
        {country?.name_ar || country?.name || country?.code?.toUpperCase() || "السعودية"}
      </span>
    </button>
  );
}
