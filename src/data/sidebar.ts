import {
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Package,
  ScrollText,
  ShoppingCart,
  Tags,
  type LucideIcon,
} from "lucide-react";

export type SidebarNavItem = {
  href: string;
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
  isDashboard?: boolean;
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    href: "/",
    label: "لوحة التحكم",
    ariaLabel: "لوحة التحكم",
    icon: LayoutDashboard,
    isDashboard: true,
  },
  {
    href: "/categories",
    label: "التصنيفات",
    ariaLabel: "التصنيفات",
    icon: Tags,
  },
  {
    href: "/products",
    label: "المنتجات",
    ariaLabel: "المنتجات",
    icon: Package,
  },
  {
    href: "/cities",
    label: "المدن",
    ariaLabel: "المدن",
    icon: MapPin,
  },
  {
    href: "/consultation-requests",
    label: "طلبات الاستشارة",
    ariaLabel: "طلبات الاستشارة",
    icon: ClipboardList,
  },
  {
    href: "/registration-requests",
    label: "طلبات التسجيل",
    ariaLabel: "طلبات التسجيل",
    icon: ScrollText,
  },
  {
    href: "/product-orders",
    label: "طلبات المنتجات",
    ariaLabel: "طلبات المنتجات",
    icon: ShoppingCart,
  },
];
