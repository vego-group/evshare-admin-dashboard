import type { ShipmentDetail } from "@/types";

import { DetailRow, DetailSection } from "./shipment-detail-parts";

type ShipmentPartiesProps = {
  shipment: ShipmentDetail;
};

/** Sender and recipient are snapshotted at creation time and are not editable. */
function ShipmentParties({ shipment }: ShipmentPartiesProps) {
  const { sender, recipient } = shipment;

  return (
    <>
      <DetailSection title="المُرسِل">
        <DetailRow label="الاسم" value={sender?.name} />
        <DetailRow label="الجوال" value={sender?.mobile} dir="ltr" />
        <DetailRow label="البريد الإلكتروني" value={sender?.email} dir="ltr" />
        <DetailRow label="العنوان" value={sender?.location?.address} />
        <DetailRow label="المدينة" value={sender?.location?.city?.name} />
      </DetailSection>

      <DetailSection title="المستلِم">
        <DetailRow label="الاسم" value={recipient?.name} />
        <DetailRow label="الجوال" value={recipient?.mobile} dir="ltr" />
        <DetailRow
          label="البريد الإلكتروني"
          value={recipient?.email}
          dir="ltr"
        />
        <DetailRow label="العنوان" value={recipient?.location?.address} />
        <DetailRow label="الحي" value={recipient?.district} />
        <DetailRow label="الرمز البريدي" value={recipient?.postcode} dir="ltr" />
        <DetailRow
          label="العنوان الوطني المختصر"
          value={recipient?.short_address_code}
          dir="ltr"
        />
        <DetailRow label="المدينة" value={recipient?.location?.city?.name} />
      </DetailSection>
    </>
  );
}

export default ShipmentParties;
