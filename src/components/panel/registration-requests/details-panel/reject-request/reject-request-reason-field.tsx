type RejectRequestReasonFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function RejectRequestReasonField({
  value,
  onChange,
}: RejectRequestReasonFieldProps) {
  return (
    <div className="space-y-2 text-right">
      <label
        htmlFor="reject-request-reason"
        className="block text-sm font-medium leading-5 text-dark-gray"
      >
        سبب الرفض *
      </label>
      <textarea
        id="reject-request-reason"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="يرجى توضيح سبب رفض الطلب بشكل واضح..."
        className="h-[121px] w-full resize-none rounded-[14px] border border-border bg-[#f9fafb] px-4 py-3 text-right text-base font-normal leading-6 text-secondary outline-none transition placeholder:text-secondary/50 focus:border-red/60 focus:ring-2 focus:ring-red/15"
      />
    </div>
  );
}

export default RejectRequestReasonField;
