import { Mail, Phone, User } from "lucide-react";

import type { RegistrationRequest } from "@/types";
import OwnerInfoRow from "./owner-info-row";
import PanelSectionTitle from "./panel-section-title";

function OwnerInfoSection({ request }: { request: RegistrationRequest }) {
  return (
    <section className="space-y-4">
      <PanelSectionTitle>معلومات المالك</PanelSectionTitle>
      <div className="space-y-4 rounded-[14px] bg-background p-5">
        <OwnerInfoRow icon={User} label="الاسم" value={request.owner.name} />
        <OwnerInfoRow
          icon={Phone}
          label="الهاتف"
          value={request.owner.phone}
          valueDir="ltr"
        />
        <OwnerInfoRow
          icon={Mail}
          label="البريد الإلكتروني"
          value={request.owner.email}
        />
      </div>
    </section>
  );
}

export default OwnerInfoSection;
