import Header from "@/components/ui/header";

function SettingsHeader() {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header title="الإعدادات" subtitle="التحكم في الإعدادات العامة للنظام" />
    </section>
  );
}

export default SettingsHeader;
