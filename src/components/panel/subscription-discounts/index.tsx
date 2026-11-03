"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  Pencil,
  Percent,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Header from "@/components/ui/header";
import EmptyState from "@/components/ui/empty-state";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import MoneyValue from "@/components/ui/money-value";
import QueryErrorState from "@/components/ui/query-error-state";
import Shimmer from "@/components/ui/shimmer";
import { ADMIN_PERMISSIONS, PAGE_SIZE } from "@/constants";
import { useHasPermission } from "@/hooks";
import {
  useCurrentSubscriptionPricing,
  useSubscriptionDiscount,
  useSubscriptionDiscounts,
} from "@/hooks/api";
import {
  subscriptionDiscountSchema,
  type SubscriptionDiscountFormValues,
} from "@/schemas";
import {
  addSubscriptionDiscount,
  deleteSubscriptionDiscount,
  editSubscriptionDiscount,
} from "@/services/mutations";
import type {
  SubscriptionDiscount,
  SubscriptionDiscountQueryParams,
  SubscriptionDiscountStatus,
  SubscriptionDiscountType,
} from "@/types";
import { preventNegativeNumberInput } from "@/lib/utils/non-negative-input";
import { cn } from "@/lib/utils";
import { confirmPricingChange } from "@/lib/utils/confirm-pricing-change";
import { invalidatePricingQueries } from "@/lib/pricing-queries";
import { notifyForbidden } from "@/lib/toast-events";
import { PricingConfigurationMeta } from "@/components/ui/pricing-configuration-meta";
import FilterSelect, {
  type FilterOption,
} from "../promos/toolbar/filter-select";
import {
  formatSubscriptionDiscountDate,
  getSubscriptionDiscountFieldErrors,
  toSubscriptionDiscountInputDate,
  toSubscriptionDiscountPayload,
} from "./utils";

const inputClass =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

export default function SubscriptionDiscounts() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<SubscriptionDiscountQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [editing, setEditing] = useState<SubscriptionDiscount | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<SubscriptionDiscount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const canView = useHasPermission(ADMIN_PERMISSIONS.subscriptionDiscounts.view);
  const canEdit = useHasPermission(ADMIN_PERMISSIONS.subscriptionDiscounts.edit);
  const canDelete = useHasPermission(ADMIN_PERMISSIONS.subscriptionDiscounts.delete);
  const hasRowActions = canView || canEdit || canDelete;
  const {
    data,
    isLoading,
    isError: isListError,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useSubscriptionDiscounts(params);
  const {
    data: pricing,
    isLoading: isPricingLoading,
    isError: isPricingError,
    isFetching: isPricingFetching,
    refetch: refetchPricing,
  } = useCurrentSubscriptionPricing();
  const isPageLoading = isLoading || isPricingLoading;
  const discounts = Array.isArray(data?.data) ? data.data : [];

  const refresh = async () => invalidatePricingQueries(queryClient);
  const openForm = (discount: SubscriptionDiscount | null) => {
    setEditing(discount);
    setFormOpen(true);
  };

  async function remove() {
    if (!pendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteSubscriptionDiscount(pendingDelete.id);
    setIsDeleting(false);
    if (!result.ok) {
      if (result.status === 403) {
        setPendingDelete(null);
        notifyForbidden(result.error);
        return;
      }
      return toast.error(result.message || "تعذر حذف الخصم");
    }
    setPendingDelete(null);
    showSuccessModal(result.message || "تم حذف الخصم بنجاح");
    await refresh();
  }

  const meta = data?.meta;

  if (isPageLoading) {
    return <SubscriptionDiscountsPageShimmer />;
  }

  if (isListError || isPricingError) {
    return (
      <QueryErrorState
        title="تعذر تحميل خصومات الاشتراك"
        isRetrying={isListFetching || isPricingFetching}
        onRetry={() => void Promise.all([refetchList(), refetchPricing()])}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Header
          title="خصومات الاشتراك التلقائية"
          subtitle="إدارة الخصم المطبق تلقائياً ومعاينة سعر الاشتراك الحالي"
        />
        <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.add}>
          <Button
            className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto"
            onClick={() => openForm(null)}
          >
            <Plus className="size-5" /> إضافة خصم تلقائي
          </Button>
        </PermissionGate>
      </section>

      <PricingSummary pricing={pricing?.data} />

      <div className="flex items-start gap-3 border-y border-border-subtle px-1 py-3 text-sm leading-6 text-text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-[#8a6500]" aria-hidden="true" />
        <p>
          يُطبّق الخصم التلقائي أولاً، ثم يُحسب كود الخصم على المبلغ المتبقي.
          لا تؤثر التعديلات أو الحذف على الاشتراكات التي بدأت سابقاً.
        </p>
      </div>

      <DiscountToolbar
        params={params}
        onChange={(next) => setParams({ ...params, ...next, page: 1 })}
      />

      {discounts.length ? (
        <section className="overflow-hidden rounded-lg bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
              <thead>
                <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
                  {[
                    "الاسم",
                    "النوع",
                    "القيمة",
                    "الفترة",
                    "التفعيل",
                    "الحالة الآن",
                    ...(hasRowActions ? ["الإجراءات"] : []),
                  ].map((label) => (
                    <th
                      key={label}
                      className="border-b border-primary/15 px-5 py-5"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <DiscountRow
                    key={discount.id}
                    discount={discount}
                    onView={() => setViewingId(discount.id)}
                    onEdit={() => openForm(discount)}
                    onDelete={() => setPendingDelete(discount)}
                    showActions={hasRowActions}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState description="لا توجد خصومات اشتراك تلقائية مطابقة." />
      )}

      <DiscountPagination
        meta={meta}
        onPageChange={(page) => setParams({ ...params, page })}
      />

      <PermissionGate
        slug={editing
          ? ADMIN_PERMISSIONS.subscriptionDiscounts.edit
          : ADMIN_PERMISSIONS.subscriptionDiscounts.add}
      >
        {formOpen && <DiscountForm
          key={editing?.id ?? "new"}
          open={formOpen}
          discount={editing}
          onClose={() => setFormOpen(false)}
          onSaved={refresh}
        />}
      </PermissionGate>
      <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.view}>
        <DiscountDetails
          open={Boolean(viewingId)}
          discountId={viewingId}
          onClose={() => setViewingId(null)}
        />
      </PermissionGate>
      <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.delete}>
        <DeleteConfirmModal
          discount={pendingDelete}
          isDeleting={isDeleting}
          onClose={() => !isDeleting && setPendingDelete(null)}
          onConfirm={remove}
        />
      </PermissionGate>
    </div>
  );
}

function SubscriptionDiscountsPageShimmer() {
  return (
    <div
      className="flex w-full flex-col gap-6"
      role="status"
      aria-label="Loading subscription discounts"
    >
      <span className="sr-only">Loading subscription discounts</span>

      <section
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-72 max-w-full rounded-lg bg-neutral-200" />
          <Shimmer className="h-4 w-112 max-w-full rounded-md bg-neutral-200" />
        </div>
        <div className="flex h-12 w-48 shrink-0 items-center justify-center gap-2 rounded-2xl bg-neutral-200 px-5">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-32 rounded-md bg-neutral-300" />
        </div>
      </section>

      <PricingSummaryShimmer />

      <section
        aria-hidden="true"
        className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex h-10 w-full items-center justify-between rounded-xl border border-neutral-100 px-4 sm:w-49"
          >
            <Shimmer className="h-4 w-16 rounded-md bg-neutral-200" />
            <Shimmer className="size-4 bg-neutral-200" />
          </div>
        ))}
      </section>

      <DiscountsShimmer />

      <section
        aria-hidden="true"
        className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3"
      >
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer
              key={index}
              className={`size-8 rounded-lg ${index === 2 ? "bg-neutral-300" : "bg-neutral-200"}`}
            />
          ))}
        </div>
        <Shimmer className="h-4 w-28 rounded-md bg-neutral-200" />
      </section>
    </div>
  );
}

function PricingSummary({
  pricing,
}: {
  pricing?: {
    base_price: number;
    discount_amount: number;
    final_price: number;
    currency?: string;
    discount: SubscriptionDiscount | null;
  };
}) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Price
          label="السعر الأساسي"
          value={pricing?.base_price}
          currency={pricing?.currency}
          icon="money"
        />
        <Price
          label="الخصم المطبق الآن"
          value={pricing?.discount_amount}
          currency={pricing?.currency}
          icon="money"
        />
        <Price
          label="السعر النهائي"
          value={pricing?.final_price}
          currency={pricing?.currency}
          icon="money"
        />
        <div className="flex min-h-29 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="grid size-12 place-items-center rounded-xl bg-primary/15 text-secondary">
            <Percent className="size-5" />
          </div>
          <div>
            <p className="text-sm text-gray">الخصم الساري</p>
            <p className="mt-1 max-w-40 truncate text-base font-semibold text-secondary">
              {pricing?.discount?.name || "لا يوجد"}
            </p>
          </div>
        </div>
      </section>
      {pricing ? <PricingConfigurationMeta metadata={pricing} compact /> : null}
    </>
  );
}

function PricingSummaryShimmer() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-29 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <Shimmer className="size-12 shrink-0 rounded-xl bg-primary/10" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <Shimmer
                className={`h-4 max-w-full rounded-md bg-neutral-200 ${index === 1 ? "w-36" : "w-28"}`}
              />
              <Shimmer
                className={`h-7 max-w-full rounded-md bg-neutral-300 ${index === 3 ? "w-32" : "w-24"}`}
              />
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Shimmer
            key={index}
            className={`h-7 rounded-full bg-white ${index === 1 ? "w-28" : "w-24"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Price({
  label,
  value,
  currency,
  icon,
}: {
  label: string;
  value?: number;
  currency?: string;
  icon: "money" | "percent";
}) {
  return (
    <div className="flex min-h-29 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="grid size-12 place-items-center rounded-xl bg-primary/15 text-secondary">
        {icon === "money" ? (
          <Banknote className="size-5" />
        ) : (
          <Percent className="size-5" />
        )}
      </div>
      <div>
        <p className="text-sm text-gray">{label}</p>
        <div className="mt-1 text-xl font-bold text-secondary">
          <MoneyValue value={value ?? 0} currency={currency} />
        </div>
      </div>
    </div>
  );
}

const typeOptions: FilterOption<SubscriptionDiscountType | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نسبة مئوية", value: "percentage" },
  { label: "مبلغ ثابت", value: "fixed" },
];
const statusOptions: FilterOption<SubscriptionDiscountStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "ساري الآن", value: "active" },
  { label: "غير ساري", value: "inactive" },
];

function DiscountToolbar({
  params,
  onChange,
}: {
  params: SubscriptionDiscountQueryParams;
  onChange: (params: Partial<SubscriptionDiscountQueryParams>) => void;
}) {
  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row sm:justify-start"
      dir="rtl"
    >
      <FilterSelect
        label="النوع"
        options={typeOptions}
        value={params.type ?? "all"}
        onChange={(value) =>
          onChange({ type: value === "all" ? undefined : value })
        }
      />
      <FilterSelect
        label="الحالة"
        options={statusOptions}
        value={params.status ?? "all"}
        onChange={(value) =>
          onChange({ status: value === "all" ? undefined : value })
        }
      />
    </section>
  );
}

const discountHeaderWidths = [
  "w-16",
  "w-16",
  "w-16",
  "w-20",
  "w-16",
  "w-20",
  "w-20",
];

const discountNameWidths = ["w-28", "w-36", "w-24", "w-32", "w-28"];

function DiscountsShimmer() {
  return (
    <section className="overflow-hidden rounded-lg bg-white" aria-hidden="true">
      <div className="overflow-x-auto">
        <div className="min-w-225">
          <div className="grid grid-cols-[1.35fr_0.9fr_0.65fr_1.25fr_0.8fr_0.9fr_128px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
            {discountHeaderWidths.map((width, index) => (
              <Shimmer
                key={index}
                className={`h-5 ${width} rounded-md bg-neutral-300`}
              />
            ))}
          </div>

          {discountNameWidths.map((nameWidth, rowIndex) => (
            <div
              key={rowIndex}
              className="grid min-h-18 grid-cols-[1.35fr_0.9fr_0.65fr_1.25fr_0.8fr_0.9fr_128px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Shimmer className="size-12 shrink-0 rounded-xl bg-primary/10" />
                <Shimmer
                  className={`h-5 ${nameWidth} max-w-[70%] rounded-md bg-neutral-200`}
                />
              </div>
              <Shimmer className="h-8.5 w-24 rounded-full bg-neutral-200" />
              <Shimmer className="h-5 w-16 rounded-md bg-neutral-200" />
              <Shimmer className="h-5 w-32 rounded-md bg-neutral-200" />
              <Shimmer className="h-8.5 w-20 rounded-full bg-neutral-200" />
              <Shimmer className="h-8.5 w-24 rounded-full bg-neutral-200" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, actionIndex) => (
                  <Shimmer
                    key={actionIndex}
                    className="size-8 rounded-lg bg-neutral-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type PaginationMeta = SubscriptionDiscountListMeta;
type SubscriptionDiscountListMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};
function DiscountPagination({
  meta,
  onPageChange,
}: {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (!meta || meta.lastPage <= 1) return null;
  const start = Math.max(1, meta.currentPage - 2);
  const end = Math.min(meta.lastPage, start + 4);
  const normalizedStart = Math.max(1, end - 4);
  const pages = Array.from(
    { length: end - normalizedStart + 1 },
    (_, index) => normalizedStart + index,
  );
  const from = (meta.currentPage - 1) * meta.perPage + 1;
  const to = Math.min(meta.currentPage * meta.perPage, meta.total);
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-dark-gray">
      <p className="order-2">
        عرض {from}-{to} من {meta.total}
      </p>
      <div className="order-1 flex items-center gap-2" dir="ltr">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          aria-label="الصفحة السابقة"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === meta.currentPage ? "default" : "outline"}
            size="sm"
            className="min-w-8"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon-sm"
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          aria-label="الصفحة التالية"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function DiscountRow({
  discount,
  onView,
  onEdit,
  onDelete,
  showActions,
}: {
  discount: SubscriptionDiscount;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean;
}) {
  const period = `${formatSubscriptionDiscountDate(discount.start_date) || "فوراً"} — ${formatSubscriptionDiscountDate(discount.end_date) || "دون انتهاء"}`;
  return (
    <tr className="text-dark-gray">
      <td className="border-b border-primary/15 px-5 py-3">
        <div className="flex max-w-60 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
            <Percent className="size-5" />
          </div>
          <p className="truncate text-base font-medium">
            {discount.name || discount.name_ar || discount.name_en || "—"}
          </p>
        </div>
      </td>
      <td className="border-b border-primary/15 px-5 py-3">
        <span className="inline-flex h-8.5 items-center rounded-full bg-blue-50 px-4 text-sm font-medium text-blue-600">
          {discount.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
        </span>
      </td>
      <td className="border-b border-primary/15 px-5 py-3" dir="ltr">
        {discount.type === "percentage" ? (
          `${discount.value}%`
        ) : (
          <MoneyValue value={discount.value} currency={discount.currency} />
        )}
      </td>
      <td
        className="whitespace-nowrap border-b border-primary/15 px-5 py-3"
        dir="ltr"
      >
        {period}
      </td>
      <td className="border-b border-primary/15 px-5 py-3">
        <Badge
          active={discount.is_active}
          activeText="مفعّل"
          inactiveText="معطّل"
        />
      </td>
      <td className="border-b border-primary/15 px-5 py-3">
        <Badge
          active={discount.is_running}
          activeText="ساري"
          inactiveText="غير ساري"
        />
      </td>
      {showActions ? <td className="border-b border-primary/15 px-5 py-3">
        <div className="flex gap-2">
          <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.view}>
            <button
              aria-label="عرض التفاصيل"
              onClick={onView}
              className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:brightness-95"
            >
              <Eye className="size-4" />
            </button>
          </PermissionGate>
          <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.edit}>
            <button
              aria-label="تعديل"
              onClick={onEdit}
              className="grid size-8 place-items-center rounded-lg bg-amber-50 text-orange-500 transition hover:brightness-95"
            >
              <Pencil className="size-4" />
            </button>
          </PermissionGate>
          <PermissionGate slug={ADMIN_PERMISSIONS.subscriptionDiscounts.delete}>
            <button
              aria-label="حذف"
              onClick={onDelete}
              className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:brightness-95"
            >
              <Trash2 className="size-4" />
            </button>
          </PermissionGate>
        </div>
      </td> : null}
    </tr>
  );
}

function DiscountDetails({
  open,
  discountId,
  onClose,
}: {
  open: boolean;
  discountId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useSubscriptionDiscount(discountId);
  const discount = data?.data;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تفاصيل الخصم التلقائي"
      description="بيانات إعداد خصم الاشتراك المحدد"
      contentClassName="md:max-w-xl"
    >
      {isLoading ? (
        <p className="p-8 text-center text-gray">جاري تحميل التفاصيل...</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-red-50 p-4 text-center text-red-700">
          تعذر تحميل التفاصيل. قد لا تملك الصلاحية أو تم تغييرها أثناء الجلسة.
        </p>
      ) : null}
      {discount ? (
        <div className="grid gap-4 p-2 sm:grid-cols-2">
          <Detail
            label="الاسم"
            value={discount.name || discount.name_ar || discount.name_en || "—"}
          />
          <Detail
            label="النوع"
            value={discount.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
          />
          <Detail
            label="القيمة"
            value={
              discount.type === "percentage" ? (
                `${discount.value}%`
              ) : (
                <MoneyValue
                  value={discount.value}
                  currency={discount.currency}
                />
              )
            }
          />
          <Detail
            label="التفعيل"
            value={discount.is_active ? "مفعّل" : "معطّل"}
          />
          <Detail
            label="الحالة الآن"
            value={discount.is_running ? "ساري" : "غير ساري"}
          />
          <Detail
            label="تاريخ الإنشاء"
            value={formatSubscriptionDiscountDate(discount.created_at) || "—"}
          />
          <Detail
            label="تاريخ البدء"
            value={formatSubscriptionDiscountDate(discount.start_date) || "فوراً"}
          />
          <Detail
            label="تاريخ الانتهاء"
            value={formatSubscriptionDiscountDate(discount.end_date) || "دون انتهاء"}
          />
          <Detail label="الاسم بالعربية" value={discount.name_ar || "—"} />
          <Detail label="الاسم بالإنجليزية" value={discount.name_en || "—"} />
          <div className="sm:col-span-2">
            <PricingConfigurationMeta metadata={discount} />
          </div>
        </div>
      ) : null}
      <div className="mt-5 flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          إغلاق
        </Button>
      </div>
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <p className="mb-1 text-xs text-gray">{label}</p>
      <p className="font-medium text-secondary">{value}</p>
    </div>
  );
}

function Badge({
  active,
  activeText,
  inactiveText,
}: {
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      className={`inline-flex h-8.5 items-center gap-2 rounded-full px-4 text-sm font-medium ${active ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray"}`}
    >
      <span
        className={`size-2 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`}
      />
      {active ? activeText : inactiveText}
    </span>
  );
}

function DeleteConfirmModal({
  discount,
  isDeleting,
  onClose,
  onConfirm,
}: {
  discount: SubscriptionDiscount | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={Boolean(discount)}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-50 text-5xl text-red-500">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد أنك تريد حذف الخصم{" "}
            <span className="inline-block max-w-60 truncate align-bottom">
              {discount?.name || discount?.name_ar || discount?.name_en || ""}
            </span>
            ؟
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">
            سيتوقف تطبيق هذا الخصم فوراً، ولا يمكن التراجع عن عملية الحذف.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-neutral-100 text-base text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-[#f04438] text-base text-white hover:bg-[#d92d20]"
          >
            {isDeleting ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function DiscountForm({
  open,
  discount,
  onClose,
  onSaved,
}: {
  open: boolean;
  discount: SubscriptionDiscount | null;
  onClose: () => void;
  onSaved: () => Promise<unknown>;
}) {
  const form = useForm<SubscriptionDiscountFormValues>({
    resolver: zodResolver(subscriptionDiscountSchema),
    defaultValues: {
      type: discount?.type ?? "percentage",
      value: discount?.value,
      is_active: discount?.is_active ?? false,
      start_date: toSubscriptionDiscountInputDate(discount?.start_date),
      end_date: toSubscriptionDiscountInputDate(discount?.end_date),
      name_ar: discount?.name_ar ?? "",
      name_en: discount?.name_en ?? "",
    },
  });
  const type = useWatch({ control: form.control, name: "type" });
  const startDate = useWatch({ control: form.control, name: "start_date" });
  const endDate = useWatch({ control: form.control, name: "end_date" });
  async function submit(values: SubscriptionDiscountFormValues) {
    if (
      values.is_active &&
      !confirmPricingChange(
        "سيصبح هذا الخصم مؤهلاً للتطبيق على المعاملات ضمن الفترة المحددة. هل تريد المتابعة؟",
      )
    )
      return;
    const payload = toSubscriptionDiscountPayload(values);
    const result = discount
      ? await editSubscriptionDiscount(discount.id, payload)
      : await addSubscriptionDiscount(payload);
    if (!result.ok) {
      if (result.status === 403) {
        onClose();
        notifyForbidden(result.error);
        return;
      }
      const fieldErrors = getSubscriptionDiscountFieldErrors(result.error);
      const entries = Object.entries(fieldErrors) as Array<
        [keyof SubscriptionDiscountFormValues, string]
      >;
      for (const [field, message] of entries) {
        form.setError(field, { type: "server", message });
      }
      if (!entries.length) {
        form.setError("root", {
          type: "server",
          message: result.message || "تعذر حفظ الخصم",
        });
        toast.error(result.message || "تعذر حفظ الخصم");
      }
      return;
    }
    showSuccessModal(result.message || "تم حفظ الخصم بنجاح");
    onClose();
    await onSaved();
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={discount ? "تعديل الخصم التلقائي" : "إضافة خصم تلقائي"}
      description="يطبق الخصم تلقائياً على سعر الاشتراك دون كود ترويجي"
      contentClassName="md:max-w-[720px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <form
        onSubmit={form.handleSubmit(submit)}
        className="grid gap-x-5 gap-y-5 p-1 text-right sm:grid-cols-2 md:p-4"
      >
        <Field
          htmlFor="subscription-discount-name-ar"
          label="الاسم بالعربية"
          error={form.formState.errors.name_ar?.message}
        >
          <input
            id="subscription-discount-name-ar"
            placeholder="عرض الاشتراك السنوي"
            className={inputClass}
            aria-invalid={Boolean(form.formState.errors.name_ar)}
            aria-describedby={form.formState.errors.name_ar ? "subscription-discount-name-ar-error" : undefined}
            {...form.register("name_ar")}
          />
        </Field>
        <Field
          htmlFor="subscription-discount-name-en"
          label="الاسم بالإنجليزية"
          error={form.formState.errors.name_en?.message}
        >
          <input
            id="subscription-discount-name-en"
            dir="ltr"
            placeholder="Annual subscription offer"
            className={inputClass}
            aria-invalid={Boolean(form.formState.errors.name_en)}
            aria-describedby={form.formState.errors.name_en ? "subscription-discount-name-en-error" : undefined}
            {...form.register("name_en")}
          />
        </Field>
        <Field label="نوع الخصم" error={form.formState.errors.type?.message}>
          <DiscountTypeDropdown
            value={type}
            onChange={(value) =>
              form.setValue("type", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </Field>
        <Field
          htmlFor="subscription-discount-value"
          label={type === "percentage" ? "القيمة (%)" : "القيمة"}
          error={form.formState.errors.value?.message}
        >
          <div className="relative">
            <input
              id="subscription-discount-value"
              type="number"
              inputMode="decimal"
              min="0"
              max={type === "percentage" ? 100 : undefined}
              step="0.01"
              dir="ltr"
              placeholder={type === "percentage" ? "25" : "100"}
              onInput={(event) => {
                if (
                  type === "percentage" &&
                  Number(event.currentTarget.value) > 100
                )
                  event.currentTarget.value = "100";
              }}
              onKeyDown={(event) =>
                preventNegativeNumberInput(event, { allowDecimal: true })
              }
              className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${type === "percentage" ? "pr-10" : ""}`}
              aria-invalid={Boolean(form.formState.errors.value)}
              aria-describedby={form.formState.errors.value ? "subscription-discount-value-error" : undefined}
              {...form.register("value", { valueAsNumber: true })}
            />
            {type === "percentage" ? (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray">
                %
              </span>
            ) : null}
          </div>
        </Field>
        <Field
          label="تاريخ البدء (بتوقيت المستأجر)"
          error={form.formState.errors.start_date?.message}
        >
          <DatePicker
            ariaLabel="تاريخ بدء الخصم"
            placement="top"
            value={startDate}
            maxDate={endDate}
            placeholder="اختر تاريخ البدء"
            onChange={(value) =>
              form.setValue("start_date", value ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </Field>
        <Field
          label="تاريخ الانتهاء (بتوقيت المستأجر)"
          error={form.formState.errors.end_date?.message}
        >
          <DatePicker
            ariaLabel="تاريخ انتهاء الخصم"
            placement="top"
            value={endDate}
            minDate={startDate}
            placeholder="اختر تاريخ الانتهاء"
            onChange={(value) =>
              form.setValue("end_date", value ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </Field>
        <label className="flex h-14 items-center gap-3 rounded-[14px] border border-primary bg-primary/4 px-4 sm:col-span-2">
          <input
            type="checkbox"
            className="size-5 accent-primary"
            {...form.register("is_active")}
          />
          <span className="text-sm font-medium text-dark-gray">
            تفعيل الخصم
          </span>
        </label>
        {form.formState.errors.root?.message ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
          >
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              (Boolean(discount) && !form.formState.isDirty)
            }
            className="h-14 rounded-[14px] bg-primary px-6 text-base font-medium text-secondary hover:bg-primary/90"
          >
            {form.formState.isSubmitting ? (
              <Loader />
            ) : discount ? (
              "حفظ التعديلات"
            ) : (
              "إضافة الخصم"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
            className="h-14 rounded-[14px] bg-neutral-100 px-6 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-right text-sm font-medium text-dark-gray">
          {label}
        </label>
      ) : (
        <p className="mb-2 text-right text-sm font-medium text-dark-gray">{label}</p>
      )}
      {children}
      {error ? (
        <span id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1 block text-xs text-red-600">{error}</span>
      ) : null}
    </div>
  );
}

function DiscountTypeDropdown({
  value,
  onChange,
}: {
  value: SubscriptionDiscountType;
  onChange: (value: SubscriptionDiscountType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options: { label: string; value: SubscriptionDiscountType }[] = [
    { label: "نسبة مئوية", value: "percentage" },
    { label: "مبلغ ثابت", value: "fixed" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative h-14 w-full">
      <button
        type="button"
        aria-label="نوع الخصم"
        aria-haspopup="listbox"
        aria-controls="subscription-discount-type-options"
        aria-expanded={isOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            return;
          }
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          onChange(value === "percentage" ? "fixed" : "percentage");
          setIsOpen(true);
        }}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span>{options.find((option) => option.value === value)?.label}</span>
        <ChevronDown
          className={cn(
            "size-5 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen ? (
        <div id="subscription-discount-type-options" role="listbox" aria-label="خيارات نوع الخصم" className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-11 w-full items-center px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
