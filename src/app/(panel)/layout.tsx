import PageShell from "@/components/ui/page-shell";
import Sidebar from "@/components/sidebar";
import SearchDirectionController from "@/components/panel/search-direction-controller";
import { PermissionsProvider } from "@/provider/permissions";
import type { ReactNode } from "react";
import { getCountry } from "@/lib";
import PanelPermissionGuard from "@/components/panel-permission-guard";
import { CurrencyProvider } from "@/provider/currency";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
  children: ReactNode;
};

async function AdminLayout({ children }: AdminLayoutProps) {
  const country = await getCountry();
  if (!country) redirect("/login?expired=1");

  return (
    <CurrencyProvider countryCode={country}>
    <PermissionsProvider>
      <SearchDirectionController />
      <div className="min-h-svh">
        <a href="#dashboard-main" className="sr-only fixed start-4 top-4 z-[100] rounded-xl bg-secondary px-5 py-3 text-white focus:not-sr-only">انتقل إلى المحتوى</a>
        <Sidebar countryCode={country} />
        <main id="dashboard-main" tabIndex={-1} className="min-w-0 md:pr-16 lg:pr-64">
          <PageShell><PanelPermissionGuard>{children}</PanelPermissionGuard></PageShell>
        </main>
      </div>
    </PermissionsProvider>
    </CurrencyProvider>
  );
}

export default AdminLayout;
