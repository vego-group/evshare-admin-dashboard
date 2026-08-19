"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import Header from "@/components/ui/header";
import ProductsContentShimmer from "@/components/panel/products/content-shimmer";
import { useDriverPricingSettings } from "@/hooks/api";
import { DRIVER_PRICING_SETTING_KEYS, type DriverPricingSetting } from "@/types";
import { GROUPS, SETTING_META } from "./config";
import EditSettingModal from "./edit-modal";
import SettingsGroup from "./settings-group";

const EMPTY_SETTINGS: DriverPricingSetting[] = [];

export default function DriverPricingSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDriverPricingSettings();
  const [editing, setEditing] = useState<DriverPricingSetting | null>(null);
  const settings = data?.data ?? EMPTY_SETTINGS;
  const missingCount = DRIVER_PRICING_SETTING_KEYS.length - settings.length;
  const grouped = useMemo(() => GROUPS.map((group) => ({
    group, settings: settings.filter((setting) => SETTING_META[setting.setting_name].group === group.id),
  })), [settings]);

  if (isLoading) return <ProductsContentShimmer />;

  return (
    <div className="flex w-full flex-col gap-7">
      <Header title="تسعير السائق والمحفظة" subtitle="إدارة ثوابت التسعير والرصيد والموقع التي يقرأها تطبيق السائق عند التشغيل" />
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        إجمالي الرحلة = رسوم الفتح + (الدقائق المحتسبة × سعر الدقيقة). لا تدخل المسافة في فوترة رحلات السائق، وتُثبّت التعرفة عند بدء الرحلة.
      </div>
      {isError ? <Notice text="تعذر تحميل إعدادات التسعير والمحفظة. حاول تحديث الصفحة." /> : null}
      {!isError && missingCount > 0 ? <Notice text={`لم يُرجع الخادم ${missingCount} من أصل 13 إعداداً. ستُستخدم قيم الخادم الافتراضية للإعدادات غير الموجودة.`} /> : null}
      {grouped.map(({ group, settings: groupSettings }) => <SettingsGroup key={group.id} group={group} settings={groupSettings} onEdit={setEditing} />)}
      <EditSettingModal setting={editing} onClose={() => setEditing(null)} onSaved={async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["driver-pricing-settings"] }),
          queryClient.invalidateQueries({ queryKey: ["settings"] }),
        ]);
      }} />
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle className="size-5 shrink-0" /><p>{text}</p></div>;
}
