import Modal from "@/components/ui/modal";
import EntityError from "./entity-error";
import DetailsShimmer from "./details-shimmer";

export default function DetailsModal(props: {
  open: boolean;
  title: string;
  loading: boolean;
  error?: unknown;
  fields: { label: string; value: React.ReactNode }[];
  onClose: () => void;
}) {
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.title} contentClassName="max-w-xl rounded-2xl">
      {props.loading ? <DetailsShimmer /> : props.error ? (
        <div className="p-4"><EntityError error={props.error} /></div>
      ) : (
        <dl className="grid gap-3 p-4 sm:grid-cols-2">
          {props.fields.map((field) => (
            <div key={field.label} className="rounded-[14px] bg-background p-4">
              <dt className="text-xs font-medium text-gray">{field.label}</dt>
              <dd className="mt-1.5 break-words text-sm font-semibold text-secondary">{field.value || "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </Modal>
  );
}
