import type { ReactNode } from "react";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-base font-medium leading-6 text-[#6a7282]">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default DetailRow;
