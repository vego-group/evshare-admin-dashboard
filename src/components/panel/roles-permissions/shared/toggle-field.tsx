export default function ToggleField(props: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex h-12 cursor-pointer items-center justify-between rounded-[14px] border border-neutral-200 bg-white px-4 text-sm text-secondary transition hover:border-primary/60">
      <span>{props.label}</span>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
        className="size-5 accent-primary"
      />
    </label>
  );
}
