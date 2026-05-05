import { CloseButtonPanel } from "@/components/ui/panel";

function RequestDetailsHeader({ requestId }: { requestId: string }) {
  return (
    <header className="flex h-[101px] shrink-0 items-center justify-between border-b border-gray/20 px-6 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium leading-8 text-secondary">
          تفاصيل الطلب
        </h2>
        <p className="text-sm leading-5 text-gray">{requestId}</p>
      </div>
      <CloseButtonPanel closeButtonClassname="static size-10 rounded-[14px] border-0 bg-primary text-secondary hover:bg-primary/90" />
    </header>
  );
}

export default RequestDetailsHeader;
