import { AlertTriangle, Pencil } from "lucide-react";
import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import MoneyValue from "@/components/ui/money-value";
import type { DriverPricingSetting } from "@/types";
import { SETTING_META } from "./config";
import { PricingConfigurationMeta } from "@/components/ui/pricing-configuration-meta";

type Props = { setting: DriverPricingSetting; onEdit: (setting: DriverPricingSetting) => void };

export default function SettingCard({ setting, onEdit }: Props) {
  const meta = SETTING_META[setting.setting_name];
  const values = setting.setting_name === "wallet_suggested_top_up_amounts"
    ? setting.setting_value.split(",").map((value) => value.trim()).filter(Boolean)
    : null;

  return (
    <article className="flex min-h-44 flex-col justify-between gap-5 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-secondary">{meta.label}</h3>
            {meta.critical ? <AlertTriangle className="size-4 text-amber-600" aria-label="إعداد مؤثر على الفوترة" /> : null}
          </div>
          <p className="text-sm leading-6 text-gray">{meta.description}</p>
        </div>
        <PermissionGate slug="Admin Edit Settings">
          <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-xl bg-primary/10" onClick={() => onEdit(setting)} aria-label={`تعديل ${meta.label}`}>
            <Pencil className="size-4" />
          </Button>
        </PermissionGate>
      </div>
      <div dir="ltr" className="flex flex-wrap items-center gap-2 text-right">
        {values ? values.map((value) => <MoneyValue key={value} value={value} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-secondary" />) : (
          <>{meta.unit === "currency" ? <MoneyValue value={setting.setting_value} className="text-2xl font-bold text-secondary" /> : <><strong className="text-2xl text-secondary">{setting.setting_value}</strong><span className="text-sm text-gray">{meta.unit}</span></>}</>
        )}
      </div>
      <PricingConfigurationMeta metadata={setting} compact />
    </article>
  );
}
