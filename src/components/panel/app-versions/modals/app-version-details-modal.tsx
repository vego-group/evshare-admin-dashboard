"use client";

import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import { useAppVersion } from "@/hooks/api";
import { cn } from "@/lib/utils";

import {
  CriticalBadge,
  formatDate,
  formatPlatform,
  StatusBadge,
} from "../results/app-version-result-parts";

type AppVersionDetailsModalProps = {
  appVersionId: string | null;
  open: boolean;
  onClose: () => void;
};

function AppVersionDetailsModal({
  appVersionId,
  open,
  onClose,
}: AppVersionDetailsModalProps) {
  const { data, isLoading } = useAppVersion(appVersionId);
  const appVersion = data?.data;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[680px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تفاصيل إصدار التطبيق"
      description="عرض بيانات الإصدار المحدد"
    >
      <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden p-1 text-right md:p-4">
        {isLoading ? (
          <DetailsShimmer />
        ) : appVersion ? (
          <>
            <section className="flex flex-col gap-3 rounded-[14px] bg-background p-4">
              <div className="min-w-0">
                <p className="text-sm text-gray">
                  {formatPlatform(appVersion.platform)}
                </p>
                <h3 dir="ltr" className="text-2xl font-semibold text-secondary">
                  {appVersion.version}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={appVersion.status} />
                <CriticalBadge isCritical={appVersion.is_critical} />
              </div>
            </section>
            <section className="space-y-3 rounded-[14px] bg-background p-4">
              <DetailRow label="المعرّف" value={appVersion.id} dir="ltr" />
              <DetailRow
                label="رمز الإصدار"
                value={String(appVersion.version_code)}
                dir="ltr"
              />
              <DetailRow
                label="تاريخ الإضافة"
                value={formatDate(appVersion.created_at)}
              />
              <DetailRow
                label="ملاحظات الإصدار بالعربية"
                value={appVersion.release_notes?.ar || "-"}
                scrollable
                wrapAnywhere
              />
              <DetailRow
                label="ملاحظات الإصدار بالإنجليزية"
                value={appVersion.release_notes?.en || "-"}
                dir="ltr"
                scrollable
                wrapAnywhere
              />
            </section>
          </>
        ) : (
          <div className="grid min-h-55 place-items-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
            فشل تحميل تفاصيل الإصدار.
          </div>
        )}
      </div>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  dir,
  scrollable = false,
  wrapAnywhere = false,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
  scrollable?: boolean;
  wrapAnywhere?: boolean;
}) {
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-1 overflow-hidden rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className={cn(
          "block min-w-0 max-w-full whitespace-pre-wrap wrap-break-word text-base font-medium text-secondary",
          scrollable &&
            "max-h-15 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray/40 [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent",
          wrapAnywhere && "break-all wrap-anywhere",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function DetailsShimmer() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <Shimmer className="h-28 rounded-[14px]" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Shimmer key={index} className="h-16 rounded-[10px]" />
      ))}
    </div>
  );
}

export default AppVersionDetailsModal;
