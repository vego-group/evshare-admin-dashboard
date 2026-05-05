import { CircleAlert, CircleCheck, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

function RegistrationRequestDocuments({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const isComplete = completed === total;
  const StatusIcon = isComplete ? CircleCheck : CircleAlert;

  return (
    <span className="inline-flex items-center justify-center gap-1.5 text-base font-semibold leading-6 text-secondary">
      <FileText className="size-4 text-gray" />

      <span dir="ltr">
        {completed}/{total}
      </span>
      <StatusIcon
        className={cn("size-4", isComplete ? "text-green" : "text-orange-500")}
      />
    </span>
  );
}

export default RegistrationRequestDocuments;
