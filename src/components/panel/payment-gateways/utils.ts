import type {
  PaymentGateway,
  PaymentGatewayUserType,
  UpdatePaymentGatewayPayload,
} from "@/types";

export type GatewayDraft = {
  is_active: boolean;
  is_default: boolean;
  supported_currencies: string;
  allowed_user_types: PaymentGatewayUserType[];
  config: string;
};

export function toGatewayDraft(gateway: PaymentGateway): GatewayDraft {
  return {
    is_active: gateway.is_active,
    is_default: gateway.is_default,
    supported_currencies: (gateway.supported_currencies ?? []).join(", "),
    allowed_user_types: gateway.allowed_user_types ?? [],
    config: gateway.config ? JSON.stringify(gateway.config, null, 2) : "",
  };
}

export function buildPaymentGatewayPayload(
  gateway: PaymentGateway,
  draft: GatewayDraft,
  credentialChanges: Record<string, string>,
): UpdatePaymentGatewayPayload {
  const payload: UpdatePaymentGatewayPayload = {};
  const currencies = normalizeCurrencies(draft.supported_currencies);
  const currentCurrencies = normalizeCurrencies(
    (gateway.supported_currencies ?? []).join(","),
  );
  const config = draft.config.trim() ? parseConfig(draft.config) : {};

  if (draft.is_active !== gateway.is_active) payload.is_active = draft.is_active;
  if (draft.is_default !== gateway.is_default) payload.is_default = draft.is_default;
  if (!sameStringSet(currencies, currentCurrencies)) {
    payload.supported_currencies = currencies;
  }
  if (
    !sameStringSet(
      draft.allowed_user_types,
      gateway.allowed_user_types ?? [],
    )
  ) {
    payload.allowed_user_types = draft.allowed_user_types;
  }
  if (stableJson(config) !== stableJson(gateway.config ?? {})) {
    payload.config = config;
  }
  if (Object.keys(credentialChanges).length) {
    payload.credentials = credentialChanges;
  }

  return payload;
}

export function credentialKeys(gateway: PaymentGateway): string[] {
  return Array.from(
    new Set([
      "secret_key",
      "webhook_secret",
      ...Object.keys(gateway.credentials ?? {}),
    ]),
  );
}

function normalizeCurrencies(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,،]/)
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
}

function parseConfig(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("INVALID_CONFIG");
  }
  return parsed as Record<string, unknown>;
}

function sameStringSet(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    [...left].sort().every((item, index) => item === [...right].sort()[index])
  );
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
