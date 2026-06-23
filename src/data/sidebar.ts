import {
  ClipboardList,
  CircleDollarSign,
  CreditCard,
  Images,
  LayoutDashboard,
  MapPin,
  MessageSquareWarning,
  Package,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Tags,
  Users,
  Wallet,
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
    href: "/users",
    label: "المستخدمون",
    ariaLabel: "المستخدمون",
    icon: Users,
  },
  {
    href: "/roles-permissions",
    label: "الأدوار والصلاحيات",
    ariaLabel: "الأدوار والصلاحيات",
    icon: ShieldCheck,
  },
  {
    href: "/wallet",
    label: "المحفظة",
    ariaLabel: "المحفظة",
    icon: Wallet,
  },
  {
    href: "/cities",
    label: "المدن",
    ariaLabel: "المدن",
    icon: MapPin,
  },
  {
    href: "/sliders",
    label: "السلايدرات",
    ariaLabel: "السلايدرات",
    icon: Images,
  },
  {
    href: "/app-versions",
    label: "إصدارات التطبيقات",
    ariaLabel: "إصدارات التطبيقات",
    icon: Smartphone,
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
    href: "/orders",
    label: "طلبات المنتجات",
    ariaLabel: "طلبات المنتجات",
    icon: ShoppingCart,
  },
  {
    href: "/payment-requests",
    label: "طلبات الدفع",
    ariaLabel: "طلبات الدفع",
    icon: CreditCard,
  },
  {
    href: "/payment-gateways",
    label: "بوابات الدفع",
    ariaLabel: "بوابات الدفع",
    icon: CircleDollarSign,
  },
  {
    href: "/complaints",
    label: "الشكاوى",
    ariaLabel: "الشكاوى",
    icon: MessageSquareWarning,
  },
];
