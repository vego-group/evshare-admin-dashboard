import Header from "@/components/ui/header";

function PagesHeader() {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="الصفحات الثابتة"
        subtitle="إدارة محتوى صفحات التطبيق الثابتة"
      />
    </section>
  );
}

export default PagesHeader;
