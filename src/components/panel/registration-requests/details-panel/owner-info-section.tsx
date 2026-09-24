import { MapPin, Phone, Shield, User } from "lucide-react";

import { formatStoredPhone } from "@/lib/utils/format-phone";
import type { KycDetail } from "@/types";
import OwnerInfoRow from "./owner-info-row";
import PanelSectionTitle from "./panel-section-title";

function OwnerInfoSection({ request }: { request: KycDetail }) {
  const user = request.user;

  return (
    <section className="space-y-4">
      <PanelSectionTitle>معلومات المالك</PanelSectionTitle>
      <div className="space-y-4 rounded-[14px] bg-background p-5">
        <OwnerInfoRow icon={User} label="الاسم" value={user?.name ?? "-"} />
        <OwnerInfoRow
          icon={Phone}
          label="الهاتف"
          value={formatStoredPhone(user?.mobile) || "-"}
          valueDir="ltr"
        />
        <OwnerInfoRow icon={Shield} label="الدور" value={user?.role ?? "-"} />
        <OwnerInfoRow
          icon={MapPin}
          label="المدينة"
          value={request.city?.name ?? "-"}
        />
      </div>
    </section>
  );
}

export default OwnerInfoSection;
