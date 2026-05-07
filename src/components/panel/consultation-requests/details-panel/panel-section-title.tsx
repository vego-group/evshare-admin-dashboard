import type { ReactNode } from "react";

function PanelSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-base font-medium leading-6 text-[#6a7282]">
      {children}
    </h3>
  );
}

export default PanelSectionTitle;
