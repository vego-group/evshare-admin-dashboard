import Header from "@/components/ui/header";

function VatHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <Header
        title="ضريبة القيمة المضافة"
        subtitle="متابعة مستحقات ضريبة القيمة المضافة وتسويتها لكل فترة"
      />
    </div>
  );
}

export default VatHeader;
