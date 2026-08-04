"use client";

import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import { useTestAccount } from "@/hooks/api";
import { cn } from "@/lib/utils";

import { Amount, StatusBadge, TestAccountIcon } from "../results/test-account-result-parts";

type TestAccountDetailsModalProps = {
  testAccountId: string | null;
  open: boolean;
  onClose: () => void;
};

function TestAccountDetailsModal({
  testAccountId,
  open,
  onClose,
}: TestAccountDetailsModalProps) {
  const { data, isLoading } = useTestAccount(open ? testAccountId : null);
  const testAccount = data?.data;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[680px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="Test account details"
      description="View the selected test account pricing and user data."
    >
      <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden p-1 text-right md:p-4">
        {isLoading ? (
          <DetailsShimmer />
        ) : testAccount ? (
          <>
            <section className="flex flex-col gap-4 rounded-[14px] bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <TestAccountIcon />
                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold text-secondary" title={testAccount.user.name}>
                    {testAccount.user.name}
                  </p>
                  <p className="truncate text-sm text-gray" dir="ltr">
                    {testAccount.user.mobile}
                  </p>
                </div>
              </div>
              <StatusBadge isActive={testAccount.is_active} />
            </section>

            <section className="grid gap-3 rounded-[14px] bg-background p-4 sm:grid-cols-2">
              <DetailRow label="Test account ID" value={testAccount.id} dir="ltr" />
              <DetailRow label="User ID" value={testAccount.user.id} dir="ltr" />
              <DetailRow
                label="Subscription amount"
                value={<Amount value={testAccount.subscription_amount} />}
                dir="ltr"
              />
              <DetailRow
                label="Order amount"
                value={<Amount value={testAccount.order_amount} />}
                dir="ltr"
              />
              <DetailRow
                label="Shipping fee"
                value={<Amount value={testAccount.shipping_fee} />}
                dir="ltr"
              />
              <DetailRow
                label="VAT percentage"
                value={`${testAccount.vat_percentage}%`}
                dir="ltr"
              />
              <DetailRow
                label="Created at"
                value={formatDate(testAccount.created_at)}
                className="sm:col-span-2"
              />
            </section>
          </>
        ) : (
          <div className="grid min-h-55 place-items-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
            Failed to load test account details.
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
  className,
}: {
  label: string;
  value: React.ReactNode;
  dir?: "ltr" | "rtl";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-[10px] bg-white px-4 py-3", className)}>
      <span className="block text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className="mt-1 block min-w-0 truncate text-base font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function DetailsShimmer() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <Shimmer className="h-25 rounded-[14px]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Shimmer key={index} className="h-17 rounded-[10px]" />
        ))}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default TestAccountDetailsModal;
