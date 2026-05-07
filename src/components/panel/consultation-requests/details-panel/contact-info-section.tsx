import { Mail, Phone, User } from "lucide-react";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";

import type { ConsultationRequest } from "@/types";
import ContactInfoRow from "./contact-info-row";
import PanelSectionTitle from "./panel-section-title";

function ContactInfoSection({ request }: { request: ConsultationRequest }) {
  return (
    <section className="space-y-4">
      <PanelSectionTitle>معلومات الاتصال</PanelSectionTitle>
      <div className="space-y-4">
        <ContactInfoRow icon={User} label="الاسم" value={request.name} />
        <ContactInfoRow
          icon={Phone}
          label="الهاتف"
          value={formatSaudiPhoneNumber(request.phone)}
          valueDir="ltr"
        />
        <ContactInfoRow
          icon={Mail}
          label="البريد الإلكتروني"
          value={request.email}
          valueClassName="text-left"
        />
      </div>
    </section>
  );
}

export default ContactInfoSection;
