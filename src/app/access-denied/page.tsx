import Link from "next/link";
import { ShieldX } from "lucide-react";

import { API_ERROR_CODES } from "@/lib/utils/api-error";

type Props = {
  searchParams: Promise<{ reason?: string }>;
};

const denialCopy: Record<string, { title: string; description: string }> = {
  [API_ERROR_CODES.accountSuspended]: {
    title: "الحساب موقوف",
    description: "لا يمكن استخدام لوحة التحكم بهذا الحساب. يرجى التواصل مع الدعم.",
  },
  [API_ERROR_CODES.tenantMismatch]: {
    title: "الدولة لا تطابق الجلسة",
    description: "سجّل الدخول من جديد باستخدام الدولة التي تريد إدارتها.",
  },
  [API_ERROR_CODES.roleForbidden]: {
    title: "لا يمكن الوصول إلى لوحة التحكم",
    description: "الدور المعيّن لهذا الحساب غير مصرح له باستخدام لوحة التحكم.",
  },
};

export default async function AccessDeniedPage({ searchParams }: Props) {
  const { reason = "" } = await searchParams;
  const copy = denialCopy[reason] ?? {
    title: "غير مصرح بالوصول",
    description: "تعذر إكمال الطلب بسبب قيود الوصول على هذا الحساب.",
  };

  return (
    <main className="grid min-h-svh place-items-center bg-[#0f1118] px-4 text-center">
      <section className="w-full max-w-md space-y-5 rounded-2xl border border-primary/30 bg-white p-8 shadow-2xl">
        <ShieldX className="mx-auto size-12 text-red-500" />
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-secondary">{copy.title}</h1>
          <p className="text-sm leading-6 text-gray">{copy.description}</p>
        </div>
        {reason === API_ERROR_CODES.tenantMismatch && (
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-secondary"
          >
            تسجيل الدخول للدولة المحددة
          </Link>
        )}
      </section>
    </main>
  );
}
