import { Mail, Phone } from "lucide-react";

import { normalizePhoneForLink } from "@/lib/utils/format-phone";

import type { ConsultationRequest } from "@/types";
import PanelActionLink from "./panel-action-link";

function RequestDetailsFooter({ request }: { request: ConsultationRequest }) {
  return (
    <footer className="shrink-0 space-y-3 border-t border-[#e5e7eb] px-6 pb-8 pt-6">
      <PanelActionLink
        href={`tel:${normalizePhoneForLink(request.phone)}`}
        icon={Phone}
        className="bg-[#00a63e] hover:bg-[#009238]"
      >
        اتصال بالعميل
      </PanelActionLink>
      <PanelActionLink
        href={`mailto:${request.email}`}
        icon={Mail}
        className="bg-[#155dfc] hover:bg-[#0f4fe0]"
      >
        إرسال بريد إلكتروني
      </PanelActionLink>
    </footer>
  );
}

export default RequestDetailsFooter;
