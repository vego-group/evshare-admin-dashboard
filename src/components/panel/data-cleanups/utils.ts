import type {
  DataCleanupModuleKey,
  DataCleanupPlanItem,
  DataCleanupStatus,
} from "@/types";

export const moduleFallbackNames: Record<DataCleanupModuleKey, string> = {
  orders: "الطلبات",
  registration_requests: "طلبات التسجيل",
  consultation_requests: "طلبات الاستشارة",
  withdrawal_requests: "طلبات السحب",
  complaints: "الشكاوى",
  payment_operations: "عمليات الدفع",
};

export const statusLabels: Record<DataCleanupStatus, string> = {
  previewed: "بانتظار التأكيد",
  queued: "في قائمة الانتظار",
  running: "جارٍ التنفيذ",
  completed: "مكتمل",
  failed: "فشل",
  cancelled: "ملغي",
  expired: "منتهي الصلاحية",
};

export const detailLabels: Record<string, string> = {
  order_items: "عناصر الطلبات",
  order_commissions: "عمولات الطلبات",
  notifications_of_order: "إشعارات الطلبات",
  notifications_of_complaint: "إشعارات الشكاوى",
  notifications_of_kyc: "إشعارات التسجيل",
  notifications_of_withdrawal_request: "إشعارات طلبات السحب",
  audit_logs_of_order: "سجل تدقيق الطلبات",
  audit_logs_of_kyc: "سجل تدقيق التسجيل",
  audit_logs_of_complaint: "سجل تدقيق الشكاوى",
  audit_logs_of_withdrawal_request: "سجل تدقيق طلبات السحب",
  kyc_attachments: "مرفقات التسجيل",
  payment_gateway_transactions: "معاملات الدفع التابعة",
  receipts: "الإيصالات",
  payment_attempts: "محاولات الدفع",
  payment_provider_events: "أحداث مزود الدفع",
  refunds: "المبالغ المستردة",
  shipments: "الشحنات",
  invoices_of_orders: "فواتير الطلبات",
  promo_redemptions_of_orders: "استخدامات أكواد الخصم",
  vehicles_unlinked_from_order_items: "مركبات سيُفصل ارتباطها بالطلب (لن تُحذف)",
  vehicles_given_their_order_item_product: "مركبات سيُحفظ منتجها قبل فصل الطلب",
  transactions_kept_and_detached_from_deleted_checkouts:
    "معاملات حديثة ستبقى بعد فصل عملية التحقق القديمة",
};

export function nonZeroEntries(value: Record<string, number> | [] | null | undefined) {
  if (!value || Array.isArray(value)) return [];
  return Object.entries(value).filter((entry): entry is [string, number] =>
    typeof entry[1] === "number" && entry[1] > 0,
  );
}

export function planWarnings(
  key: DataCleanupModuleKey,
  item: DataCleanupPlanItem,
) {
  const notes = Array.isArray(item.notes) ? {} : item.notes;
  const dangling = Array.isArray(item.dangling_kept) ? {} : item.dangling_kept;
  const warnings: string[] = [];

  if (key === "registration_requests" && Number(notes.approved_kycs_deleted) > 0) {
    warnings.push(
      `سيتم حذف ${notes.approved_kycs_deleted} طلب تسجيل معتمد، وسيصبح ${Number(notes.users_left_unverified) || 0} تاجر غير موثّق.`,
    );
  }
  if (key === "orders" && Number(dangling.payment_operations_kept_for_deleted_orders) > 0) {
    warnings.push(
      `ستبقى ${dangling.payment_operations_kept_for_deleted_orders} عملية دفع مرتبطة بطلبات محذوفة.`,
    );
  }
  if (key === "withdrawal_requests" && Number(dangling.wallet_rows_referencing_withdrawal_requests) > 0) {
    warnings.push(
      `ستبقى ${dangling.wallet_rows_referencing_withdrawal_requests} حركة محفظة ولن تتغير الأرصدة.`,
    );
  }
  if (key === "payment_operations" && Number(notes.kept_for_unfinished_refunds) > 0) {
    warnings.push(
      `ستبقى ${notes.kept_for_unfinished_refunds} عملية دفع لأن استردادها لم يكتمل بعد.`,
    );
  }
  if (key === "complaints" && notes.kept_complaint_uuid) {
    warnings.push(`سيتم الاحتفاظ بالشكوى ${String(notes.kept_complaint_uuid)}.`);
  }
  if (key === "orders" && notes.attachment_files) {
    warnings.push("ستُحذف سجلات المرفقات، بينما تبقى الملفات المخزنة كما هي.");
  }
  return warnings;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRemaining(expiresAt: string, now = Date.now()) {
  const milliseconds = new Date(expiresAt).getTime() - now;
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "منتهية";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
