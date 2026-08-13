import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-background p-4">
      <span className="text-sm text-gray">{label}</span>
      <span className="text-lg font-bold text-secondary">{value}</span>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  dir,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span dir={dir} className="w-full break-all text-base font-medium text-secondary">
        {value || "-"}
      </span>
    </div>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-[14px] bg-background p-4">
      <h4 className="text-sm font-semibold text-secondary">{title}</h4>
      {children}
    </section>
  );
}
