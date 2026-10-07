import Header from "@/components/ui/header";

export type UsersViewMode = "table" | "card";

function UsersHeader() {
  return (
    <section className="flex w-full items-center justify-between">
      <Header title="المستخدمون" subtitle="إدارة ومتابعة حسابات المستخدمين" />
    </section>
  );
}

export default UsersHeader;
