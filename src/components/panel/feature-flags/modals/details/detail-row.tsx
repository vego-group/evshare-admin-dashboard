import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
};

function FeatureFlagDetailRow({ label, value, dir }: Props) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-sm text-gray">{label}</p>
      <div dir={dir} className="mt-1 break-all font-medium text-secondary">
        {value}
      </div>
    </div>
  );
}

export default FeatureFlagDetailRow;
