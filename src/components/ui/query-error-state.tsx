import { AlertCircle } from "lucide-react";

type Props = {
  title: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export default function QueryErrorState({ title, onRetry, isRetrying = false }: Props) {
  return (
    <section role="alert" className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-white p-6 text-center">
      <AlertCircle className="size-7 text-danger" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-secondary">{title}</h2>
      <p className="text-sm text-text-muted">تحقق من الاتصال ثم حاول مرة أخرى.</p>
      <button
        type="button"
        disabled={isRetrying}
        onClick={onRetry}
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-primary/80 disabled:opacity-50"
      >
        {isRetrying ? "جارٍ إعادة المحاولة..." : "إعادة المحاولة"}
      </button>
    </section>
  );
}
