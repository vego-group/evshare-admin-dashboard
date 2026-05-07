import Image from "next/image";

import Modal from "@/components/ui/modal";

type AssetsCatalogEditSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

function AssetsCatalogEditSuccessModal({
  open,
  onClose,
}: AssetsCatalogEditSuccessModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-[481px] flex-col items-center justify-center gap-2 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[113px] w-[100px]">
            <Image src="/images/success.gif" alt="" fill unoptimized />
          </div>

          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            تم تعديل الاصل بنجاح
          </h2>
        </div>

        <p className="text-base font-medium leading-6 text-[#667085]">
          تم حفظ التغييرات وتحديث بيانات المنتج داخل النظام بشكل كامل، وأصبحت
          المعلومات الجديدة هي المعتمدة حاليًا.
        </p>
      </div>
    </Modal>
  );
}

export default AssetsCatalogEditSuccessModal;
