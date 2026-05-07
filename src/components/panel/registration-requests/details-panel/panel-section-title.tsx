import type { ReactNode } from "react";

function PanelSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-medium leading-5 tracking-[0.35px] text-gray">
      {children}
    </h3>
  );
}

export default PanelSectionTitle;
