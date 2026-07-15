import { Building2, CreditCard, Phone, User } from "lucide-react";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { PaymentRequestDetail } from "@/types";
import OwnerInfoRow from "./owner-info-row";
import PanelSectionTitle from "./panel-section-title";

function UserInfoSection({ request }: { request: PaymentRequestDetail }) {
  return (
    <section className="space-y-4">
      <PanelSectionTitle>معلومات المستخدم</PanelSectionTitle>
      <div className="space-y-4 rounded-[14px] bg-background p-5">
        <OwnerInfoRow icon={User} label="الاسم" value={request.user?.name} />
        <OwnerInfoRow
          icon={Phone}
          label="الهاتف"
          value={formatSaudiPhoneNumber(request.user.mobile)}
          valueDir="ltr"
        />
        <OwnerInfoRow icon={Building2} label="البنك" value={request.bank_account?.bank_name ?? "-"} />
        <OwnerInfoRow
          icon={CreditCard}
          label="رقم الآيبان"
          value={request.bank_account?.iban ?? "-"}
          valueDir="ltr"
        />
      </div>
    </section>
  );
}

export default UserInfoSection;
