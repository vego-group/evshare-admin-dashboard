"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useOrderOperatingContract } from "@/hooks/api/orders";
import { reviewOrderOperatingContractAPI } from "@/services/mutations/orders";
import type { OrderOperatingContract, ReviewOrderOperatingContractPayload } from "@/types";

const labels: Record<OrderOperatingContract["status"], string> = {
  pending_signature: "بانتظار توقيع العميل",
  pending_admin_review: "بانتظار مراجعة الإدارة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

export default function OperatingContractSection({ orderId }: { orderId: string }) {
  const { data, isLoading, isError, refetch } = useOrderOperatingContract(orderId, true);
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const contract = data?.data;

  async function review() {
    if (!decision || submitting.current || contract?.status !== "pending_admin_review") return;
    if (decision === "rejected" && !reason.trim()) return;
    const payload: ReviewOrderOperatingContractPayload = decision === "approved"
      ? { status: "approved" }
      : { status: "rejected", rejection_reason: reason.trim() };
    submitting.current = true;
    setBusy(true);
    try {
      const result = await reviewOrderOperatingContractAPI(orderId, payload);
      if (!result.ok) {
        toast.error(result.message || "تعذر مراجعة عقد التشغيل");
        return;
      }
      toast.success(result.message || "تمت مراجعة عقد التشغيل");
      setDecision(null);
      setReason("");
      await Promise.all([
        ["order-operating-contract", orderId], ["order ", orderId], ["orders"],
        ["vehicles"], ["vehicle"], ["vehicles-all"],
      ].map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    } catch {
      toast.error("تعذر مراجعة عقد التشغيل. يرجى المحاولة مرة أخرى.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[14px] border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-secondary">عقد التشغيل</h2>
        {contract && <span className={`rounded-full px-4 py-2 text-sm ${contract.status === "approved" ? "bg-green-50 text-green-700" : contract.status === "rejected" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>{labels[contract.status]}</span>}
      </div>
      {isLoading ? <p role="status">جاري تحميل عقد التشغيل...</p> : isError ? (
        <div role="alert" className="space-y-2 text-sm text-red-600">
          <p>تعذر تحميل عقد التشغيل.</p>
          <Button variant="outline" onClick={() => void refetch()}>إعادة المحاولة</Button>
        </div>
      ) : !contract ? <p className="text-sm text-gray">لا يوجد عقد تشغيل لهذا الطلب حتى الآن.</p> : (
        <>
          <p className="text-sm text-secondary">الشركة المشغلة: {contract.operation_company.name}</p>
          {contract.signed_at && <p className="text-sm text-gray">تاريخ التوقيع: {new Date(contract.signed_at).toLocaleString("ar-EG")}</p>}
          {contract.status === "pending_signature" && <p className="text-sm text-gray">بانتظار رفع العقد الموقع من العميل.</p>}
          {contract.rejection_reason && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">سبب الرفض: {contract.rejection_reason}</p>}
          <div className="flex flex-wrap gap-3">
            {([
              ["العقد الأصلي", contract.original_contract],
              ["العقد الموقع", contract.signed_contract],
            ] as const).map(([label, file]) => file?.url ? (
              <a key={label} href={file.url} target="_blank" rel="noopener noreferrer" className="break-all rounded-lg border border-neutral-200 px-4 py-2 text-sm text-secondary hover:bg-neutral-50">{label}: {file.file_name}</a>
            ) : <p key={label} className="text-sm text-gray">{label}: غير متوفر</p>)}
          </div>
          {contract.status === "pending_admin_review" && (
            <PermissionGate slug="Admin Review Order Operating Contracts">
              <p className="text-sm text-gray">الموافقة على العقد تُكمل الطلب وتُفعّل جميع مركباته.</p>
              <div className="flex gap-3">
                <Button disabled={busy || !contract.signed_contract?.url} onClick={() => setDecision("approved")}>موافقة</Button>
                <Button variant="destructive" disabled={busy} onClick={() => setDecision("rejected")}>رفض</Button>
              </div>
              <Modal open={decision !== null} onClose={() => { if (!busy) { setDecision(null); setReason(""); } }} title={decision === "approved" ? "الموافقة على عقد التشغيل" : "رفض عقد التشغيل"} contentClassName="max-w-md">
                <div className="space-y-4">
                  {decision === "approved" ? <p>سيتم إكمال الطلب وتفعيل جميع مركباته. هل تريد تأكيد الموافقة؟</p> : (
                    <div className="space-y-2">
                      <label htmlFor="contract-rejection-reason">سبب الرفض *</label>
                      <textarea id="contract-rejection-reason" required value={reason} disabled={busy} onChange={(event) => setReason(event.target.value)} className="min-h-30 w-full rounded-lg border p-3" placeholder="وضح ما يجب على العميل تصحيحه" />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button disabled={busy || (decision === "rejected" && !reason.trim())} onClick={() => void review()}>{busy ? "جاري الحفظ..." : "تأكيد"}</Button>
                    <Button variant="outline" disabled={busy} onClick={() => { setDecision(null); setReason(""); }}>إلغاء</Button>
                  </div>
                </div>
              </Modal>
            </PermissionGate>
          )}
        </>
      )}
    </section>
  );
}
