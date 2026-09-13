import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-svh min-w-0 bg-background px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="dashboard-content">{children}</div>
    </div>
  );
}

export default PageShell;
