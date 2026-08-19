import type { DriverPricingSettingKey } from "@/types";

export type SettingMeta = {
  label: string; description: string; unit: "currency" | "sec" | "m" | "km"; group: "wallet" | "billing" | "tracking";
  critical?: boolean;
};

export const SETTING_META: Record<DriverPricingSettingKey, SettingMeta> = {
  trip_min_start_balance: { label: "الحد الأدنى لبدء الرحلة", description: "البوابة الفعلية هي القيمة الأكبر بين هذا الحد ورسوم الفتح.", unit: "currency", group: "billing", critical: true },
  wallet_low_balance_threshold: { label: "تنبيه الرصيد المنخفض", description: "يظهر عنده تنبيه يمكن للسائق إغلاقه.", unit: "currency", group: "wallet" },
  wallet_critical_balance_threshold: { label: "تنبيه الرصيد الحرج", description: "يظهر عنده تنبيه حرج غير قابل للإغلاق.", unit: "currency", group: "wallet" },
  wallet_min_top_up_amount: { label: "أقل مبلغ شحن", description: "الحد الأدنى المفروض أيضاً عند التحقق في الخادم.", unit: "currency", group: "wallet" },
  wallet_max_top_up_amount: { label: "أقصى مبلغ شحن", description: "الحد الأقصى المفروض أيضاً عند التحقق في الخادم.", unit: "currency", group: "wallet" },
  wallet_suggested_top_up_amounts: { label: "مبالغ الشحن المقترحة", description: "خيارات سريعة مفصولة بفواصل وتظهر بترتيبها في التطبيق.", unit: "currency", group: "wallet" },
  trip_billing_increment_seconds: { label: "وحدة احتساب الرحلة", description: "تُقرب مدة الرحلة لأعلى لكل وحدة بدأت، وتطبق على الرحلات الجديدة.", unit: "sec", group: "billing", critical: true },
  trip_balance_stop_grace_seconds: { label: "مهلة توقف الرصيد", description: "العد التنازلي قبل إنهاء الرحلة عند نفاد الرصيد.", unit: "sec", group: "billing" },
  trip_free_cancellation_window_seconds: { label: "نافذة الإلغاء المجاني", description: "صفر يعني إعادة رسوم الفتح دائماً؛ وبعد النافذة تُحفظ الرسوم.", unit: "sec", group: "billing", critical: true },
  trip_location_sync_interval_seconds: { label: "فاصل مزامنة تكلفة الرحلة", description: "معدل طلب التطبيق لتكلفة الرحلة الحالية.", unit: "sec", group: "tracking" },
  trip_location_post_interval_seconds: { label: "فاصل إرسال الموقع", description: "معدل إرسال التطبيق لموقع السائق.", unit: "sec", group: "tracking" },
  trip_location_post_distance_meters: { label: "مسافة إرسال الموقع", description: "الحركة المطلوبة قبل إرسال موقع جديد.", unit: "m", group: "tracking" },
  map_search_radius_km: { label: "نطاق البحث في الخريطة", description: "النطاق الافتراضي للبحث عن المركبات القريبة.", unit: "km", group: "tracking" },
};

export const GROUPS = [
  { id: "billing", title: "تسعير الرحلات", description: "قواعد بدء الرحلة والاحتساب والإلغاء" },
  { id: "wallet", title: "المحفظة والشحن", description: "حدود الرصيد ومبالغ شحن المحفظة" },
  { id: "tracking", title: "الموقع والخريطة", description: "معدلات المزامنة وإرسال الموقع ونطاق البحث" },
] as const;
