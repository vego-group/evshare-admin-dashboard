import {
  Building2,
  ClipboardList,
  CircleDollarSign,
  CreditCard,
  FileText,
  Flag,
  FlaskConical,
  Images,
  LayoutDashboard,
  MapPin,
  MapPinned,
  MessageSquareWarning,
  Navigation,
  Package,
  PackageCheck,
  Percent,
  Phone,
  Radar,
  Receipt,
  Route,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Tags,
  Ticket,
  Truck,
  Users,
  Wallet,
  Webhook,
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
  group?: SidebarNavGroupId;
};

export type SidebarNavGroupId =
  | "catalog"
  | "access"
  | "requests"
  | "shipping"
  | "fleet"
  | "finance"
  | "content"
  | "system";

export type SidebarNavGroup = {
  id: SidebarNavGroupId;
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
};

export const sidebarNavGroups: SidebarNavGroup[] = [
  { id: "catalog", label: "المتجر", ariaLabel: "المتجر", icon: Package },
  {
    id: "access",
    label: "المستخدمون والصلاحيات",
    ariaLabel: "المستخدمون والصلاحيات",
    icon: Users,
  },
  {
    id: "requests",
    label: "الطلبات",
    ariaLabel: "الطلبات",
    icon: ClipboardList,
  },
  { id: "shipping", label: "الشحن", ariaLabel: "الشحن", icon: Truck },
  {
    id: "fleet",
    label: "التشغيل والرحلات",
    ariaLabel: "التشغيل والرحلات",
    icon: Route,
  },
  {
    id: "finance",
    label: "المالية والمدفوعات",
    ariaLabel: "المالية والمدفوعات",
    icon: CircleDollarSign,
  },
  {
    id: "content",
    label: "المحتوى والتسويق",
    ariaLabel: "المحتوى والتسويق",
    icon: FileText,
  },
  {
    id: "system",
    label: "إعدادات النظام",
    ariaLabel: "إعدادات النظام",
    icon: Settings,
  },
];

export const sidebarNavItems: SidebarNavItem[] = [
  {
    href: "/",
    label: "لوحة التحكم",
    ariaLabel: "لوحة التحكم",
    icon: LayoutDashboard,
    isDashboard: true,
    permission: "Admin View Dashboard Analytics",
  },
  {
    href: "/categories",
    group: "catalog",
    label: "التصنيفات",
    ariaLabel: "التصنيفات",
    icon: Tags,
    permission: "Admin Index Categories",
  },
  {
    href: "/products",
    group: "catalog",
    label: "المنتجات",
    ariaLabel: "المنتجات",
    icon: Package,
    permission: "Admin Index Products",
  },
  {
    href: "/users",
    group: "access",
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
    group: "access",
    label: "الأدوار والصلاحيات",
    ariaLabel: "الأدوار والصلاحيات",
    icon: ShieldCheck,
    permission: [
      "Admin Index Roles",
      "Admin Index Permissions",
      "Admin Index Permission Categories",
    ],
  },
  {
    href: "/wallet",
    group: "finance",
    label: "المحفظة",
    ariaLabel: "المحفظة",
    icon: Wallet,
    permission: "Admin Index Wallet Transactions",
  },
  {
    href: "/cities",
    group: "system",
    label: "المدن",
    ariaLabel: "المدن",
    icon: MapPin,
    permission: "Admin Index Cities",
  },
  {
    href: "/sliders",
    group: "content",
    label: "السلايدرات",
    ariaLabel: "السلايدرات",
    icon: Images,
    permission: "Admin Index Slides",
  },
  {
    href: "/app-versions",
    group: "system",
    label: "إصدارات التطبيقات",
    ariaLabel: "إصدارات التطبيقات",
    icon: Smartphone,
    permission: "Admin View App Releases",
  },
  {
    href: "/feature-flags",
    group: "system",
    label: "إدارة الميزات",
    ariaLabel: "إدارة الميزات",
    icon: Flag,
    permission: "Admin Index Feature Flags",
  },
  {
    href: "/consultation-requests",
    group: "requests",
    label: "طلبات الاستشارة",
    ariaLabel: "طلبات الاستشارة",
    icon: ClipboardList,
    permission: "Admin Index Consultations",
  },
  {
    href: "/registration-requests",
    group: "requests",
    label: "طلبات التسجيل",
    ariaLabel: "طلبات التسجيل",
    icon: ScrollText,
    permission: "Admin Index KYC",
  },
  {
    href: "/orders",
    group: "catalog",
    label: "طلبات المنتجات",
    ariaLabel: "طلبات المنتجات",
    icon: ShoppingCart,
    permission: "Admin Index Orders",
  },
  {
    href: "/shipments",
    group: "shipping",
    label: "الشحنات",
    ariaLabel: "الشحنات",
    icon: Truck,
    permission: "Admin Index Shipments",
  },
  {
    href: "/shipping-companies",
    group: "shipping",
    label: "شركات الشحن",
    ariaLabel: "شركات الشحن",
    icon: PackageCheck,
    permission: "Admin Index Shipping Companies",
  },
  {
    href: "/shipping-cities",
    group: "shipping",
    label: "مدن الشحن",
    ariaLabel: "مدن الشحن",
    icon: MapPinned,
    permission: "Admin Index Shipping Cities",
  },
  {
    href: "/payment-requests",
    group: "requests",
    label: "طلبات الدفع",
    ariaLabel: "طلبات الدفع",
    icon: CreditCard,
    permission: "Admin View Payment Requests",
  },
  {
    href: "/operating-companies",
    group: "fleet",
    label: "الشركات المشغلة",
    ariaLabel: "الشركات المشغلة",
    icon: Building2,
    permission: "Admin View Operation Companies",
  },
  {
    href: "/vehicle-operating-pricing",
    group: "fleet",
    label: "تشغيل وتسعير المركبات",
    ariaLabel: "تشغيل وتسعير المركبات",
    icon: Route,
    permission: "Admin View Vehicles",
  },

  {
    href: "/trips",
    group: "fleet",
    label: "سجل الرحلات",
    ariaLabel: "سجل الرحلات",
    icon: Navigation,
    permission: "Admin View Trips",
  },
  {
    href: "/trips/active",
    group: "fleet",
    label: "الرحلات النشطة",
    ariaLabel: "الرحلات النشطة",
    icon: Radar,
    permission: "Admin View Trips",
  },
  {
    href: "/payment-gateways",
    group: "finance",
    label: "بوابات الدفع",
    ariaLabel: "بوابات الدفع",
    icon: CircleDollarSign,
    permission: ["Admin Index Checkouts", "Admin Index Transactions"],
  },
  {
    href: "/payment-methods",
    group: "finance",
    label: "طرق الدفع",
    ariaLabel: "طرق الدفع",
    icon: CreditCard,
    permission: "Admin Index Payment Methods",
  },
  {
    href: "/webhook-logs",
    group: "finance",
    label: "سجلات الويب هوك",
    ariaLabel: "سجلات الويب هوك",
    icon: Webhook,
    permission: "Admin Index Webhook Logs",
  },
  {
    href: "/commission-settings",
    group: "finance",
    label: "إعدادات العمولة",
    ariaLabel: "إعدادات العمولة",
    icon: Percent,
    permission: "Admin Index Commission Settings",
  },
  {
    href: "/finance/vat",
    group: "finance",
    label: "ضريبة القيمة المضافة",
    ariaLabel: "ضريبة القيمة المضافة",
    icon: Receipt,
    permission: "Admin View VAT",
  },
  {
    href: "/complaints",
    group: "requests",
    label: "الشكاوى",
    ariaLabel: "الشكاوى",
    icon: MessageSquareWarning,
    permission: "Admin Index Complaints",
  },
  {
    href: "/promos",
    group: "content",
    label: "أكواد الخصم",
    ariaLabel: "أكواد الخصم",
    icon: Ticket,
    permission: "Admin Index Promos",
  },
  {
    href: "/subscription-discounts",
    group: "content",
    label: "خصومات الاشتراك",
    ariaLabel: "خصومات الاشتراك التلقائية",
    icon: Percent,
    permission: "Admin Index Subscription Discounts",
  },
  {
    href: "/test-accounts",
    group: "system",
    label: "حسابات الاختبار",
    ariaLabel: "حسابات الاختبار",
    icon: FlaskConical,
    permission: "Admin Index Test Accounts",
  },
  {
    href: "/settings",
    group: "system",
    label: "الإعدادات",
    ariaLabel: "الإعدادات",
    icon: Settings,
    permission: "Admin Index Settings",
  },
  {
    href: "/driver-pricing-settings",
    group: "finance",
    label: "تسعير السائق والمحفظة",
    ariaLabel: "تسعير السائق والمحفظة",
    icon: Wallet,
    permission: "Admin Index Settings",
  },
  {
    href: "/contact-us",
    group: "content",
    label: "بيانات التواصل",
    ariaLabel: "بيانات التواصل",
    icon: Phone,
    permission: "Admin Index Settings",
  },
  {
    href: "/pages",
    group: "content",
    label: "الصفحات الثابتة",
    ariaLabel: "الصفحات الثابتة",
    icon: FileText,
    permission: "Admin Index Pages",
  },
];
