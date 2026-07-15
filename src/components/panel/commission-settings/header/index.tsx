import Header from "@/components/ui/header";

function CommissionSettingsHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <Header
        title="إعدادات العمولة"
        subtitle="إدارة إعدادات العمولة المطبقة على المعاملات في النظام"
      />
    </div>
  );
}

export default CommissionSettingsHeader;
