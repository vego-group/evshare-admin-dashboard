import PageShell from "@/components/ui/page-shell";
import Sidebar from "@/components/sidebar";
import SearchDirectionController from "@/components/panel/search-direction-controller";
import { PermissionsProvider } from "@/provider/permissions";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PermissionsProvider>
      <SearchDirectionController />
      <div className="min-h-svh">
        <Sidebar />
        <main className="md:pr-16 lg:pr-64">
          <PageShell>{children}</PageShell>
        </main>
      </div>
    </PermissionsProvider>
  );
}

export default AdminLayout;
