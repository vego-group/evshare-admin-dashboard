"use client";

import { ShieldX } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Loader from "@/components/ui/loader";
import { useUserPermissions } from "@/hooks";

type RouteRule = {
  pattern: RegExp;
  permission: string | string[];
};

// Keep specific routes before their collection route. Arrays mean that any one
// of the permissions grants access to a page containing multiple data sections.
const routeRules: RouteRule[] = [
  { pattern: /^\/$/, permission: "Admin View Dashboard Analytics" },
  { pattern: /^\/categories$/, permission: "Admin Index Categories" },
  { pattern: /^\/products\/add$/, permission: "Admin Add Products" },
  { pattern: /^\/products\/[^/]+\/edit$/, permission: "Admin Edit Products" },
  { pattern: /^\/products\/[^/]+$/, permission: "Admin Show Products" },
  { pattern: /^\/products$/, permission: "Admin Index Products" },
  { pattern: /^\/users\/[^/]+$/, permission: "Admin Show Users" },
  { pattern: /^\/users$/, permission: ["Admin Index Users", "Admin View Admins", "Admin View Merchants", "Admin View Partners", "Admin View Farmers"] },
  { pattern: /^\/roles-permissions$/, permission: ["Admin Index Roles", "Admin Index Permissions", "Admin Index Permission Categories"] },
  { pattern: /^\/wallet\/[^/]+$/, permission: "Admin Show Wallet Transactions" },
  { pattern: /^\/wallet$/, permission: "Admin Index Wallet Transactions" },
  { pattern: /^\/cities$/, permission: "Admin Index Cities" },
  { pattern: /^\/sliders$/, permission: "Admin Index Slides" },
  { pattern: /^\/app-versions$/, permission: "Admin View App Releases" },
  { pattern: /^\/feature-flags$/, permission: "Admin Index Feature Flags" },
  { pattern: /^\/consultation-requests$/, permission: "Admin Index Consultations" },
  { pattern: /^\/registration-requests$/, permission: "Admin Index KYC" },
  { pattern: /^\/orders\/[^/]+$/, permission: "Admin Show Orders" },
  { pattern: /^\/orders$/, permission: "Admin Index Orders" },
  { pattern: /^\/shipments\/[^/]+$/, permission: "Admin Details Shipments" },
  { pattern: /^\/shipments$/, permission: "Admin Index Shipments" },
  { pattern: /^\/shipping-companies$/, permission: "Admin Index Shipping Companies" },
  { pattern: /^\/shipping-cities$/, permission: "Admin Index Shipping Cities" },
  { pattern: /^\/payment-requests$/, permission: "Admin View Payment Requests" },
  { pattern: /^\/operating-companies\/[^/]+\/edit$/, permission: "Admin Edit Operation Companies" },
  { pattern: /^\/operating-companies\/[^/]+$/, permission: "Admin View Operation Companies" },
  { pattern: /^\/operating-companies$/, permission: "Admin View Operation Companies" },
  { pattern: /^\/vehicle-operating-pricing\/map$/, permission: "Admin Locate Vehicles" },
  { pattern: /^\/vehicle-operating-pricing\/[^/]+$/, permission: "Admin View Vehicles" },
  { pattern: /^\/vehicle-operating-pricing$/, permission: "Admin View Vehicles" },
  { pattern: /^\/trips(?:\/active|\/[^/]+)?$/, permission: "Admin View Trips" },
  { pattern: /^\/payment(?:-gateways|\/gateways)$/, permission: ["Admin Index Checkouts", "Admin Index Transactions"] },
  { pattern: /^\/payment-methods$/, permission: "Admin Index Payment Methods" },
  { pattern: /^\/webhook-logs$/, permission: "Admin Index Webhook Logs" },
  { pattern: /^\/commission-settings$/, permission: "Admin Index Commission Settings" },
  { pattern: /^\/finance\/vat$/, permission: "Admin View VAT" },
  { pattern: /^\/complaints$/, permission: "Admin Index Complaints" },
  { pattern: /^\/promos\/[^/]+$/, permission: "Admin View Promos" },
  { pattern: /^\/promos$/, permission: "Admin Index Promos" },
  { pattern: /^\/test-accounts$/, permission: "Admin Index Test Accounts" },
  { pattern: /^\/(?:settings|contact-us|driver-pricing-settings)$/, permission: "Admin Index Settings" },
  { pattern: /^\/pages\/[^/]+\/edit$/, permission: "Admin Edit Pages" },
  { pattern: /^\/pages$/, permission: "Admin Index Pages" },
];

export default function PanelPermissionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isLoading, hasAnyPermission } = useUserPermissions();
  const rule = routeRules.find(({ pattern }) => pattern.test(pathname));

  if (isLoading) {
    return <div className="grid min-h-[50vh] place-items-center"><Loader /></div>;
  }

  if (rule && !hasAnyPermission(rule.permission)) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-3 rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <ShieldX className="mx-auto size-10 text-red-500" />
          <h1 className="text-xl font-semibold text-secondary">غير مصرح بالوصول</h1>
          <p className="text-sm text-dark-gray">ليس لديك الصلاحية المطلوبة لعرض هذه الصفحة.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
