import PageShell from "@/components/ui/page-shell";
import Sidebar from "@/components/sidebar";
import SearchDirectionController from "@/components/panel/search-direction-controller";
import { PermissionsProvider } from "@/provider/permissions";
import type { ReactNode } from "react";
import { getCountry } from "@/lib";
import PanelPermissionGuard from "@/components/panel-permission-guard";

type AdminLayoutProps = {
  children: ReactNode;
};

async function AdminLayout({ children }: AdminLayoutProps) {
  const country = await getCountry();
  return (
    <PermissionsProvider>
      <SearchDirectionController />
      <div className="min-h-svh">
        <Sidebar countryCode={country} />
        <main className="md:pr-16 lg:pr-64">
          <PageShell><PanelPermissionGuard>{children}</PanelPermissionGuard></PageShell>
        </main>
      </div>
    </PermissionsProvider>
  );
}

export default AdminLayout;
