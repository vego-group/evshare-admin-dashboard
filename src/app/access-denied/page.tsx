import Image from "next/image";
import { CarFront, ShieldX, Store, type LucideIcon } from "lucide-react";

import AccessDeniedLogoutButton from "@/components/access-denied-logout-button";
import { API_ERROR_CODES } from "@/lib/utils/api-error";

type Props = {
  searchParams: Promise<{ reason?: string; role?: string }>;
};

const forbiddenRoles: Record<
  string,
  { label: string; description: string; icon: LucideIcon }
> = {
  merchant: {
    label: "تاجر",
    description: "هذا الحساب مخصص لتطبيق التاجر",
    icon: Store,
  },
  driver: {
    label: "سائق",
    description: "هذا الحساب مخصص لتطبيق السائق",
    icon: CarFront,
  },
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
  const { reason = "", role = "" } = await searchParams;
  const copy = denialCopy[reason] ?? {
    title: "غير مصرح بالوصول",
    description: "تعذر إكمال الطلب بسبب قيود الوصول على هذا الحساب.",
  };
  const roleInfo =
    reason === API_ERROR_CODES.roleForbidden
      ? forbiddenRoles[role.toLowerCase()]
      : undefined;
  const RoleIcon = roleInfo?.icon;

  return (
    <main
      dir="rtl"
      className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-[#0f1118] px-4 py-8"
    >
      <Image
        src="/images/scooter.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#0f1118]/82" />
      <div className="absolute -right-24 top-10 -z-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p dir="ltr" className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
            EV SHARE
          </p>
          <p className="mt-2 text-sm text-white/65">لوحة إدارة إي في شير</p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="h-1.5 bg-primary" />
          <div className="space-y-6 p-6 sm:p-9">
            <div className="space-y-4 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 ring-8 ring-red-50/60">
                <ShieldX className="size-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-secondary">
                  {copy.title}
                </h1>
                <p className="mx-auto max-w-sm text-sm leading-7 text-gray">
                  {copy.description}
                </p>
              </div>
            </div>

            {roleInfo && RoleIcon && (
              <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-[#fffaf0] p-4 text-right">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-secondary shadow-sm">
                  <RoleIcon className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray">نوع الحساب</p>
                  <p className="mt-0.5 text-base font-bold text-secondary">
                    {roleInfo.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-gray">
                    {roleInfo.description}
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-neutral-100 pt-5">
              <AccessDeniedLogoutButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
