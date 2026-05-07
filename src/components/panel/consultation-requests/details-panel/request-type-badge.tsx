import { cn } from "@/lib/utils";

import type { ConsultationRequestType } from "@/types";

const REQUEST_TYPE_STYLES: Record<ConsultationRequestType, string> = {
  مبيعات: "bg-blue-50 text-[#1447e6]",
  تقني: "bg-purple-50 text-purple-600",
  دعم: "bg-amber-50 text-amber-600",
  عام: "bg-gray-100 text-dark-gray",
};

function RequestTypeBadge({ type }: { type: ConsultationRequestType }) {
  return (
    <span
      className={cn(
        "inline-flex h-[38px] items-center justify-center rounded-full px-4 text-base font-medium leading-6",
        REQUEST_TYPE_STYLES[type],
      )}
    >
      {type}
    </span>
  );
}

export default RequestTypeBadge;
