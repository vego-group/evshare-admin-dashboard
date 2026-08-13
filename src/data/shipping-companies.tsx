import { Building2, CheckCircle2, PauseCircle } from "lucide-react";

import type { ShippingDeliveryType, ShippingServiceType } from "@/types";

export const shippingCompaniesStatConfig = [
  {
    label: "إجمالي شركات الشحن",
    key: "total",
    icon: Building2,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "شركات نشطة",
    key: "active",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "شركات غير نشطة",
    key: "inactive",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

export const shippingServiceTypeLabels: Record<ShippingServiceType, string> = {
  express: "سريع",
  sameDay: "نفس اليوم",
  pudo: "نقاط الاستلام",
  lockerDelivery: "خزائن التسليم",
  coldDelivery: "شحن مبرد",
  heavyAndBulky: "شحن ثقيل",
};

export const shippingDeliveryTypeLabels: Record<ShippingDeliveryType, string> = {
  toCustomerDoorstep: "حتى باب العميل",
  pickupByCustomer: "استلام من العميل",
  locker: "خزانة",
};

export const shippingServiceTypeOptions = (
  Object.keys(shippingServiceTypeLabels) as ShippingServiceType[]
).map((value) => ({ label: shippingServiceTypeLabels[value], value }));

export const shippingDeliveryTypeOptions = (
  Object.keys(shippingDeliveryTypeLabels) as ShippingDeliveryType[]
).map((value) => ({ label: shippingDeliveryTypeLabels[value], value }));
