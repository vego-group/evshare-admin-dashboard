import type {
  PaymentMethodsAnalysis,
  PaymentMethodsStatistics,
} from "@/types";

export type PaymentMethodStatisticItem = {
  key: string;
  label: string;
  value: number;
};

type StatisticsInput = {
  statistics?: PaymentMethodsStatistics;
  analysis?: PaymentMethodsAnalysis;
};

/**
 * Prefer the current statistics contract. The legacy branch only keeps older
 * backends useful while they still return gateway-assignment counts in analysis.
 */
export function getPaymentMethodStatisticItems({
  statistics,
  analysis,
}: StatisticsInput): PaymentMethodStatisticItem[] {
  const source = statistics ?? analysis;
  if (!source) return [];

  const items: PaymentMethodStatisticItem[] = [
    { key: "total", label: "إجمالي طرق الدفع", value: source.total },
    { key: "active", label: "طرق الدفع النشطة", value: source.active },
    { key: "inactive", label: "طرق الدفع غير النشطة", value: source.inactive },
  ];

  if ("available_for_orders" in source) {
    return [
      ...items,
      {
        key: "orders",
        label: "متاحة للطلبات",
        value: source.available_for_orders,
      },
      {
        key: "subscriptions",
        label: "متاحة للاشتراكات",
        value: source.available_for_subscriptions,
      },
    ];
  }

  return [
    ...items,
    {
      key: "merchant",
      label: "بوابات متاحة للتجار",
      value: source.merchant,
    },
    {
      key: "driver",
      label: "بوابات متاحة للسائقين",
      value: source.driver,
    },
  ];
}
