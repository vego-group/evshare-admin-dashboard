"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section role="alert" className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-border-subtle bg-white px-6 py-12 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-rose-50 text-danger"><AlertCircle className="size-7" aria-hidden="true" /></div>
      <h1 className="text-2xl font-semibold text-secondary">تعذر عرض الصفحة</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-text-muted">حدث خطأ أثناء تحميل هذه الصفحة. حاول مرة أخرى أو عد إلى لوحة التحكم.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}><RotateCcw aria-hidden="true" />إعادة المحاولة</Button>
        <Button variant="outline" asChild><Link href="/">لوحة التحكم</Link></Button>
      </div>
    </section>
  );
}
