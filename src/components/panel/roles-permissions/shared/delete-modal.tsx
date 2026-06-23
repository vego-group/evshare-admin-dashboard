import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

export default function DeleteModal(props: {
  open: boolean;
  name?: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={props.open} onClose={props.onClose} contentClassName="max-w-[520px] rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-50 text-5xl text-red-500">!</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">هل أنت متأكد من حذف <span className="font-semibold">{props.name}</span>؟</h2>
          <p className="text-base font-medium leading-6 text-[#667085]">سيتم حذف العنصر نهائيًا، ولن تتمكن من استرجاعه بعد تنفيذ هذا الإجراء.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button variant="ghost" onClick={props.onClose} disabled={props.loading} className="h-[54px] rounded-[14px] bg-neutral-100 text-base text-dark-gray hover:bg-neutral-200">إغلاق</Button>
          <Button onClick={props.onConfirm} disabled={props.loading} className="h-[54px] rounded-[14px] bg-[#f04438] text-base text-white hover:bg-[#d92d20]">
            {props.loading ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
