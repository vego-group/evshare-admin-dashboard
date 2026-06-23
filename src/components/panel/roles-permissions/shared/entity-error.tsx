type RequestError = {
  status?: number;
  response?: { status?: number };
};

export function getErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const requestError = error as RequestError;
  return requestError.status ?? requestError.response?.status;
}

export default function EntityError({ error }: { error: unknown }) {
  const notFound = getErrorStatus(error) === 404;
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
      <p className="font-medium text-dark-gray">
        {notFound ? "العنصر غير متاح أو غير موجود" : "تعذر تحميل البيانات"}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        {notFound ? "ربما تم حذف العنصر أو لم يعد بإمكانك الوصول إليه." : "يرجى المحاولة مرة أخرى لاحقًا."}
      </p>
    </div>
  );
}
