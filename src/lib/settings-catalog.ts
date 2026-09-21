import type { Setting, SettingValueType } from "@/types/settings";

export type SettingDefinition = {
  type: SettingValueType;
  min?: number;
  max?: number;
  options?: string[];
  owner: string;
  scope: "tenant" | "environment" | "global";
};

const decimal = (owner: string, min: number, max: number): SettingDefinition => ({
  type: "decimal", owner, scope: "tenant", min, max,
});
const integer = (owner: string, min: number, max: number): SettingDefinition => ({
  type: "integer", owner, scope: "tenant", min, max,
});

export const SETTINGS_CATALOG: Record<string, SettingDefinition> = {
  vat_value: decimal("Finance", 0, 100),
  delivery_fee: decimal("Commerce", 0, 10_000),
  subscription_price: decimal("Commerce", 0, 100_000),
  maintenance_mode: { type: "boolean", owner: "Platform", scope: "environment" },
  kyc_default_status: { type: "enum", options: ["pending", "approved"], owner: "Compliance", scope: "tenant" },
  work_conditions_ar: { type: "html", max: 65_535, owner: "Legal", scope: "tenant" },
  work_conditions_en: { type: "html", max: 65_535, owner: "Legal", scope: "tenant" },
  contact_us_whatsapp: { type: "phone", owner: "Support", scope: "tenant" },
  contact_us_mobile: { type: "phone", owner: "Support", scope: "tenant" },
  contact_us_email: { type: "email", max: 255, owner: "Support", scope: "tenant" },
  trip_min_start_balance: decimal("Mobility", 0, 10_000),
  trip_billing_increment_seconds: integer("Mobility", 1, 3_600),
  trip_balance_stop_grace_seconds: integer("Mobility", 0, 3_600),
  trip_free_cancellation_window_seconds: integer("Mobility", 0, 3_600),
  trip_location_sync_interval_seconds: integer("Mobility", 1, 3_600),
  trip_location_post_interval_seconds: integer("Mobility", 1, 3_600),
  trip_location_post_distance_meters: integer("Mobility", 1, 10_000),
  map_search_radius_km: decimal("Mobility", 0.1, 500),
  wallet_low_balance_threshold: decimal("Finance", 0, 100_000),
  wallet_critical_balance_threshold: decimal("Finance", 0, 100_000),
  wallet_min_top_up_amount: decimal("Finance", 1, 100_000),
  wallet_max_top_up_amount: decimal("Finance", 1, 1_000_000),
  wallet_suggested_top_up_amounts: { type: "csv_decimal", owner: "Finance", scope: "tenant" },
  currency_code: { type: "enum", options: ["SAR", "JOD", "EGP", "AED", "USD", "ILS"], owner: "Finance", scope: "tenant" },
  currency_symbol_ar: { type: "string", max: 16, owner: "Finance", scope: "tenant" },
  currency_symbol_en: { type: "string", max: 16, owner: "Finance", scope: "tenant" },
  currency_minor_units: integer("Finance", 0, 4),
};

export function settingDefinition(setting: Pick<Setting, "setting_name" | "type" | "rules" | "owner" | "scope">): SettingDefinition {
  const catalog = SETTINGS_CATALOG[setting.setting_name];
  if (catalog) return catalog;

  const rules = setting.rules ?? [];
  const ruleNumber = (name: string) => {
    const rule = rules.find((item) => item.startsWith(`${name}:`));
    return rule ? Number(rule.slice(name.length + 1)) : undefined;
  };
  const enumRule = rules.find((item) => item.startsWith("in:"));
  return {
    type: setting.type ?? "string",
    min: ruleNumber("min"),
    max: ruleNumber("max"),
    options: enumRule?.slice(3).split(","),
    owner: setting.owner ?? "Platform",
    scope: setting.scope ?? "tenant",
  };
}

export function validateSettingValue(setting: Setting, rawValue: string): string | null {
  const value = rawValue.trim();
  if (!value) return "القيمة مطلوبة";
  const definition = settingDefinition(setting);

  if (definition.type === "boolean") {
    return ["0", "1", "true", "false"].includes(value) ? null : "اختر قيمة منطقية صالحة";
  }
  if (definition.type === "enum") {
    return definition.options?.includes(value) ? null : "القيمة ليست ضمن الخيارات المسموحة";
  }
  if (definition.type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "البريد الإلكتروني غير صالح";
  }
  if (definition.type === "phone") {
    return /^\+?[0-9]{7,15}$/.test(value) ? null : "رقم الهاتف غير صالح";
  }
  if (definition.type === "csv_decimal") {
    const values = value.split(",").map((item) => item.trim());
    return values.length > 0 && values.every((item) => item !== "" && Number.isFinite(Number(item)) && Number(item) >= 0)
      ? null
      : "أدخل أرقاماً موجبة مفصولة بفواصل";
  }
  if (definition.type === "decimal" || definition.type === "integer") {
    const number = Number(value);
    if (!Number.isFinite(number)) return "القيمة الرقمية غير صالحة";
    if (definition.type === "integer" && !Number.isInteger(number)) return "يجب أن تكون القيمة عدداً صحيحاً";
    if (definition.min != null && number < definition.min) return `القيمة يجب ألا تقل عن ${definition.min}`;
    if (definition.max != null && number > definition.max) return `القيمة يجب ألا تتجاوز ${definition.max}`;
  }
  if (definition.max != null && ["string", "html", "email"].includes(definition.type) && value.length > definition.max) {
    return `القيمة يجب ألا تتجاوز ${definition.max} حرفاً`;
  }
  return null;
}
