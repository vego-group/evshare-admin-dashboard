"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { useCustomQuery, useHasPermission } from "@/hooks";
import { operatingCompanyContractAPI } from "@/services/queries/operating-companies";
import { uploadOperatingCompanyContractAPI } from "@/services/mutations/operating-companies";

export default function CompanyContractSection({ companyId }: { companyId: string }) {
  const canView = useHasPermission("Admin View Operation Companies");
  const { data, isLoading, isError, refetch } = useCustomQuery(
    ["operating-company-contract", companyId],
    () => operatingCompanyContractAPI(companyId),
    { enabled: Boolean(companyId) && canView, retry: false },
  );
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);

  async function upload() {
    if (!file || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    try {
      const form = new FormData();
      form.set("contract", file);
      const result = await uploadOperatingCompanyContractAPI(companyId, form);
      if (!result.ok) { toast.error(result.message || "تعذر رفع العقد"); return; }
      toast.success(result.message || "تم حفظ عقد التشغيل");
      setFile(null);
      if (input.current) input.current.value = "";
      await Promise.all([
        ["operating-company-contract", companyId], ["operating-company", companyId], ["operating-companies"],
      ].map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    } catch {
      toast.error("تعذر رفع العقد. يرجى المحاولة مرة أخرى.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[14px] border border-neutral-200 bg-white p-5">
      <h2 className="font-semibold text-secondary">عقد التشغيل الأساسي</h2>
      <p className="text-sm text-gray">يُستخدم هذا العقد للطلبات الجديدة عند التسليم. استبداله لا يغير نسخ العقود المحفوظة للطلبات السابقة.</p>
      {canView && (isLoading ? <p role="status">جاري تحميل العقد...</p> : isError ? (
        <div role="alert" className="space-y-2"><p className="text-sm text-red-600">تعذر تحميل العقد.</p><Button variant="outline" onClick={() => void refetch()}>إعادة المحاولة</Button></div>
      ) : data?.data?.url ? (
        <a href={data.data.url} target="_blank" rel="noopener noreferrer" className="block break-all text-sm text-primary underline">عرض العقد: {data.data.file_name || "عقد التشغيل"}</a>
      ) : <p className="text-sm text-gray">لم يتم رفع عقد تشغيل للشركة بعد.</p>)}
      <PermissionGate slug="Admin Edit Operation Companies">
        <div className="space-y-3">
          <label htmlFor={`company-contract-${companyId}`} className="block text-sm font-medium">رفع / استبدال العقد (PDF، DOC، DOCX — حتى 10 ميجابايت)</label>
          <input ref={input} id={`company-contract-${companyId}`} type="file" accept=".pdf,.doc,.docx" disabled={busy} className="block w-full rounded-lg border p-3 text-sm" onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(null);
            if (selected && (!/\.(pdf|doc|docx)$/i.test(selected.name) || selected.size === 0 || selected.size > 10 * 1024 * 1024)) {
              toast.error("اختر ملف PDF أو DOC أو DOCX غير فارغ بحجم لا يتجاوز 10 ميجابايت.");
              event.target.value = "";
              return;
            }
            setFile(selected);
          }} />
          {file && <p className="break-all text-sm text-gray">سيتم حفظ {file.name} واستبدال العقد الحالي إن وجد.</p>}
          <Button type="button" disabled={!file || busy} onClick={() => void upload()}>{busy ? "جاري رفع العقد..." : "حفظ عقد التشغيل"}</Button>
        </div>
      </PermissionGate>
    </section>
  );
}
