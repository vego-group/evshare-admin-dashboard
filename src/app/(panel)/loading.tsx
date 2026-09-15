export default function DashboardLoading() {
  return (
    <section role="status" aria-label="جارٍ تحميل الصفحة" className="space-y-6">
      <span className="sr-only">جارٍ تحميل الصفحة، يرجى الانتظار.</span>
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="space-y-3 border-s-[3px] border-primary ps-4">
          <div className="h-8 w-48 rounded-lg bg-neutral-200" />
          <div className="h-4 w-64 max-w-full rounded bg-neutral-200" />
        </div>
        <div className="h-16 rounded-2xl border border-border-subtle bg-white" />
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white p-5 sm:p-6">
          <div className="mb-6 h-10 rounded-lg bg-surface-subtle" />
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex gap-6 border-b border-border-subtle py-5 last:border-0">
              <div className="h-4 w-1/3 rounded bg-neutral-100" />
              <div className="h-4 w-1/4 rounded bg-neutral-100" />
              <div className="ms-auto h-4 w-16 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
