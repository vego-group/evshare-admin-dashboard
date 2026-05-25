"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Info, MessageSquare, Send, User } from "lucide-react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useComplaint } from "@/hooks/api";
import { cn } from "@/lib/utils";
import { answerComplaintAPI } from "@/services/mutations";
import type { Complaint, ComplaintStatus } from "@/types";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  new: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-orange-500",
  answered: "bg-green-50 text-green",
};

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  new: "جديدة",
  in_progress: "قيد المعالجة",
  answered: "تم الرد",
};

interface ComplaintsDetailsPanelProps {
  complaintId: string | null;
  open: boolean;
  onClose: () => void;
}

function ComplaintsDetailsPanel({
  complaintId,
  open,
  onClose,
}: ComplaintsDetailsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useComplaint(complaintId);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const complaint = data?.data;

  if (!complaintId) return null;

  async function refreshComplaintQueries(currentComplaintId: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["complaints"] }),
      queryClient.invalidateQueries({
        queryKey: ["complaint", currentComplaintId],
      }),
    ]);
  }

  async function handleAnswerComplaint() {
    if (!complaintId || answerLoading || !adminResponse.trim()) return;

    const currentComplaintId = complaintId;
    setAnswerLoading(true);
    const result = await answerComplaintAPI(currentComplaintId, { response: adminResponse.trim() });
    setAnswerLoading(false);

    if (result?.ok) {
      toast.success(result.message || "تم الرد على الشكوى بنجاح");
      setShowAnswerForm(false);
      setAdminResponse("");
      await refreshComplaintQueries(currentComplaintId);
      return;
    }

    toast.error(result?.message || "فشل الرد على الشكوى");
  }

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
      title="تفاصيل الشكوى"
      titleClassName="text-2xl font-medium leading-8 text-secondary"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <ComplaintDetailsShimmer />
          ) : complaint ? (
            <ComplaintDetails complaint={complaint} />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل تفاصيل الشكوى.
            </div>
          )}
        </div>

        {complaint && complaint.status !== "answered" ? (
          <footer className="shrink-0 border-t border-gray/20 px-6 pb-5 pt-6">
            {showAnswerForm ? (
              <div className="space-y-3">
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={4}
                  className="w-full resize-none rounded-[14px] border border-gray/20 bg-background p-4 text-right text-base text-secondary placeholder:text-gray focus:border-primary focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={handleAnswerComplaint}
                    disabled={answerLoading || !adminResponse.trim()}
                    className={cn(
                      "h-12 rounded-[14px] bg-primary text-base font-medium leading-6 text-white hover:bg-primary/90",
                      answerLoading && "gap-2",
                    )}
                  >
                    {answerLoading ? <Loader /> : <Send className="size-5" />}
                    إرسال الرد
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAnswerForm(false);
                      setAdminResponse("");
                    }}
                    disabled={answerLoading}
                    className="h-12 rounded-[14px] text-base font-medium leading-6"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setShowAnswerForm(true)}
                className="h-12 w-full rounded-[14px] bg-primary text-base font-medium leading-6 text-white hover:bg-primary/90"
              >
                <MessageSquare className="size-5" />
                الرد على الشكوى
              </Button>
            )}
          </footer>
        ) : null}
      </div>
    </Panel>
  );
}

function ComplaintDetails({ complaint }: { complaint: Complaint }) {
  return (
    <div className="space-y-8">
      <div className="flex h-[58px] items-center justify-between gap-3 rounded-[14px] border border-blue/20 bg-blue/8 px-4 text-right">
        <Info className="size-5 shrink-0 text-blue" />
        <p className="w-full text-base font-normal leading-6 text-blue">
          <span className="flex items-center justify-between gap-3">
            <span>حالة الشكوى</span>
            <StatusBadge status={complaint.status} />
          </span>
        </p>
      </div>

      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <DetailRow label="رقم الشكوى" value={complaint.complaint_number} valueDir="ltr" />
        <DetailRow label="العنوان" value={complaint.title ?? "-"} breakAll />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(complaint.created_at)}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium leading-5 tracking-[0.35px] text-gray">
          تفاصيل الشكوى
        </h3>
        <div className="rounded-[14px] bg-background p-5">
          <p className="break-all text-base font-normal leading-7 text-secondary">
            {complaint.message}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium leading-5 tracking-[0.35px] text-gray">
          معلومات المستخدم
        </h3>
        <div className="space-y-4 rounded-[14px] bg-background p-5">
          <div className="flex items-center gap-3">
            <User className="size-5 shrink-0 text-gray" />
            <div className="min-w-0 text-right">
              <p className="text-sm font-normal leading-5 text-gray">الاسم</p>
              <p className="mt-1 truncate text-base font-normal leading-6 text-secondary">
                {complaint.user.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="size-5 shrink-0 text-gray" />
            <div className="min-w-0 text-right">
              <p className="text-sm font-normal leading-5 text-gray">الدور</p>
              <p className="mt-1 truncate text-base font-normal leading-6 text-secondary">
                {complaint.user.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {complaint.admin_response ? (
        <section className="space-y-4">
          <h3 className="text-sm font-medium leading-5 tracking-[0.35px] text-gray">
            رد الإدارة
          </h3>
          <div className="rounded-[14px] bg-background p-5">
            <p className="break-all text-base font-normal leading-7 text-secondary">
              {complaint.admin_response}
            </p>
          </div>
          {complaint.responder ? (
            <p className="text-sm text-gray">
              بواسطة: {complaint.responder.name}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function ComplaintDetailsShimmer() {
  return (
    <div className="space-y-8">
      <div className="flex h-[58px] items-center justify-between gap-3 rounded-[14px] border border-blue/10 bg-blue/5 px-4">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-[34px] w-28" />
      </div>
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"
          >
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-5 w-36" />
          </div>
        ))}
      </section>
      <section className="space-y-4">
        <Shimmer className="h-6 w-32" />
        <div className="rounded-[14px] bg-background p-5">
          <Shimmer className="h-20 w-full rounded-md" />
        </div>
      </section>
      <section className="space-y-4">
        <Shimmer className="h-6 w-32" />
        <div className="space-y-4 rounded-[14px] bg-background p-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Shimmer className="size-5" />
              <div className="min-w-0 flex-1 space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueDir,
  breakAll,
}: {
  label: string;
  value: string;
  valueDir?: "ltr" | "rtl";
  breakAll?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3">
      <span className="text-sm text-gray">{label}</span>
      <span dir={valueDir} className={cn("min-w-0 text-base font-medium text-secondary", breakAll ? "break-all" : "truncate")}>
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default ComplaintsDetailsPanel;
