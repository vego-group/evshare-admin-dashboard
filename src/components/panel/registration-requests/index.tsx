import Header from "@/components/ui/header";
import StatsCards from "./Statscards";
import RegistrationRequestsTable from "./components/registration-requests-table";
import RegistrationRequestsToolbar from "./registration-requests-toolbar";

function RegistrationRequests() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="طلبات التسجيل" subtitle="إدارة ومتابعة طلبات تسجيل" />
      <StatsCards />
      <RegistrationRequestsToolbar />
      <RegistrationRequestsTable />
    </div>
  );
}

export default RegistrationRequests;
