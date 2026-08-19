import type { DriverPricingSetting } from "@/types";
import type { GROUPS } from "./config";
import SettingCard from "./setting-card";

type Group = (typeof GROUPS)[number];
type Props = { group: Group; settings: DriverPricingSetting[]; onEdit: (setting: DriverPricingSetting) => void };

export default function SettingsGroup({ group, settings, onEdit }: Props) {
  if (!settings.length) return null;
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-bold text-secondary">{group.title}</h2><p className="mt-1 text-sm text-gray">{group.description}</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((setting) => <SettingCard key={setting.id} setting={setting} onEdit={onEdit} />)}
      </div>
    </section>
  );
}
