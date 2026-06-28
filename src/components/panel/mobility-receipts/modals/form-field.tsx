import InputErrorMessage from "@/components/ui/input-error-message";

type Props = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function ReceiptFormField({ label, error, children }: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-dark-gray">
        {label}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default ReceiptFormField;
