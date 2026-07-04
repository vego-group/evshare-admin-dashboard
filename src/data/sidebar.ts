import {
  ClipboardList,
  CircleDollarSign,
  CreditCard,
  Flag,
  Images,
  LayoutDashboard,
  MapPin,
  MessageSquareWarning,
  Package,
  Route,
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
  /** Permission slug(s) required to see this item (any one matches); omit to show it to everyone. */
  permission?: string | string[];
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
    permission: "Admin Index Categories",
  },
  {
    href: "/products",
    label: "المنتجات",
    ariaLabel: "المنتجات",
    icon: Package,
    permission: "Admin Index Products",
  },
  {
    href: "/users",
    label: "المستخدمون",
    ariaLabel: "المستخدمون",
    icon: Users,
    permission: [
      "Admin View Admins",
      "Admin View Merchants",
      "Admin View Partners",
      "Admin View Farmers",
    ],
  },
  {
    href: "/roles-permissions",
    label: "الأدوار والصلاحيات",
    ariaLabel: "الأدوار والصلاحيات",
    icon: ShieldCheck,
    permission: ["Admin Index Roles", "Admin Index Permissions"],
  },
  {
    href: "/wallet",
    label: "المحفظة",
    ariaLabel: "المحفظة",
    icon: Wallet,
    permission: ["Admin Index Checkouts", "Admin Index Transactions"],
  },
  {
    href: "/cities",
    label: "المدن",
    ariaLabel: "المدن",
    icon: MapPin,
    permission: "Admin Index Cities",
  },
  {
    href: "/sliders",
    label: "السلايدرات",
    ariaLabel: "السلايدرات",
    icon: Images,
    permission: "Admin Index Slides",
  },
  {
    href: "/app-versions",
    label: "إصدارات التطبيقات",
    ariaLabel: "إصدارات التطبيقات",
    icon: Smartphone,
  },
  {
    href: "/feature-flags",
    label: "إدارة الميزات",
    ariaLabel: "إدارة الميزات",
    icon: Flag,
  },
  {
    href: "/consultation-requests",
    label: "طلبات الاستشارة",
    ariaLabel: "طلبات الاستشارة",
    icon: ClipboardList,
    permission: "Admin Index Consultations",
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
    permission: "Admin Index Orders",
  },
  {
    href: "/payment-requests",
    label: "طلبات الدفع",
    ariaLabel: "طلبات الدفع",
    icon: CreditCard,
    permission: "Admin View Payment Requests",
  },
  {
    href: "/vehicle-operating-pricing",
    label: "تشغيل وتسعير المركبات",
    ariaLabel: "تشغيل وتسعير المركبات",
    icon: Route,
  },
  {
    href: "/payment-gateways",
    label: "بوابات الدفع",
    ariaLabel: "بوابات الدفع",
    icon: CircleDollarSign,
  },
  {
    href: "/payment-methods",
    label: "طرق الدفع",
    ariaLabel: "طرق الدفع",
    icon: CreditCard,
    permission: "Admin Index Payment Methods",
  },
  {
    href: "/complaints",
    label: "الشكاوى",
    ariaLabel: "الشكاوى",
    icon: MessageSquareWarning,
    permission: "Admin Index Complaints",
  },
];
