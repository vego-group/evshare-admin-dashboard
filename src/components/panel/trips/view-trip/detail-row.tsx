import type { ReactNode } from "react";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-primary/5 px-3 py-2">
      <span className="text-sm text-gray">{label}</span>
      <span className="min-w-0 text-left text-sm font-medium text-secondary">{value}</span>
    </div>
  );
}

export default DetailRow;
