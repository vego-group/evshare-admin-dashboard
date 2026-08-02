import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-svh bg-background px-4 py-6 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}

export default PageShell;
