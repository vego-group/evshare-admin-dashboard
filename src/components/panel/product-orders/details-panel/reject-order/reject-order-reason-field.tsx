type RejectOrderReasonFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function RejectOrderReasonField({
  value,
  onChange,
}: RejectOrderReasonFieldProps) {
  return (
    <div dir="rtl" className="space-y-2 text-right">
      <label
        htmlFor="reject-order-reason"
        className="block text-sm font-medium leading-5 text-dark-gray"
      >
        سبب الرفض *
      </label>
      <textarea
        id="reject-order-reason"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="يرجى توضيح سبب رفض الطلب بشكل واضح للتاجر..."
        className="h-[121px] w-full resize-none rounded-[14px] border border-border bg-[#f9fafb] px-4 py-3 text-right text-base font-normal leading-6 text-secondary outline-none transition placeholder:text-secondary/50 focus:border-red/60 focus:ring-2 focus:ring-red/15"
      />
      <p className="text-center text-xs leading-4 text-gray">
        سيتم إرسال هذا السبب للتاجر عبر البريد الإلكتروني
      </p>
    </div>
  );
}

export default RejectOrderReasonField;
