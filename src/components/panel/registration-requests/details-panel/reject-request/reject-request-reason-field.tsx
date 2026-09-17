type RejectRequestReasonFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function RejectRequestReasonField({
  value,
  onChange,
  error,
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
        maxLength={1000}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "reject-request-reason-error" : "reject-request-reason-help"}
        placeholder="يرجى توضيح سبب رفض الطلب بشكل واضح..."
        className="h-[121px] w-full resize-none rounded-[14px] border border-border bg-[#f9fafb] px-4 py-3 text-right text-base font-normal leading-6 text-secondary outline-none transition placeholder:text-secondary/50 focus:border-red/60 focus:ring-2 focus:ring-red/15"
      />
      {error ? (
        <p id="reject-request-reason-error" className="text-sm text-danger">{error}</p>
      ) : (
        <p id="reject-request-reason-help" className="text-sm text-gray">
          يجب أن يكون سبب الرفض بين 10 و1000 حرف ({value.trim().length}/1000).
        </p>
      )}
    </div>
  );
}

export default RejectRequestReasonField;
