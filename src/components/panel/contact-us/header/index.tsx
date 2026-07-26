import Header from "@/components/ui/header";

function ContactUsHeader() {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="بيانات التواصل"
        subtitle="التحكم في بيانات التواصل الظاهرة للمستخدمين"
      />
    </section>
  );
}

export default ContactUsHeader;
