import type { LucideIcon } from "lucide-react";

export type ProductOrderStat = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
};

export type ProductOrderStatus = "موافق عليه" | "مرفوض" | "قيد المراجعة";

export type ProductOrderType = "سكوتر كهربائي" | "دراجة كهربائية";

export type ProductOrder = {
  id: string;
  merchantName: string;
  merchantEmail: string;
  merchantPhone: string;
  productName: string;
  productDescription: string;
  productImageSrc: string;
  price: string;
  type: ProductOrderType;
  status: ProductOrderStatus;
  date: string;
  createdAt: string;
  createdTime: string;
};
