import { Info } from "lucide-react";
import type { ReactNode } from "react";

function ReviewAlert({ message }: { message: ReactNode }) {
  return (
    <div className="flex h-[58px] items-center gap-3 rounded-[14px] border border-blue/20 bg-blue/8 px-4 text-right">
      <Info className="size-5 shrink-0 text-blue" />
      <p className="text-base w-full font-normal leading-6 text-blue">
        {message}
      </p>
    </div>
  );
}

export default ReviewAlert;
