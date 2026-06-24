"use client";

import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import { useFeatureFlag } from "@/hooks/api";

import FeatureFlagStatusBadge from "../../status-badge";
import FeatureFlagDetailRow from "./detail-row";

type Props = {
  featureFlagId: string | null;
  open: boolean;
  onClose: () => void;
};

function FeatureFlagDetailsModal({ featureFlagId, open, onClose }: Props) {
  const { data, isLoading } = useFeatureFlag(featureFlagId);
  const flag = data?.data;

  return (
    <Modal open={open} onClose={onClose} title="تفاصيل الميزة">
      <div className="space-y-3 p-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Shimmer key={index} className="h-16 rounded-xl" />
          ))
        ) : flag ? (
          <>
            <FeatureFlagDetailRow label="المفتاح" value={flag.key} dir="ltr" />
            <FeatureFlagDetailRow label="الاسم بالعربية" value={flag.name_ar} />
            <FeatureFlagDetailRow
              label="الاسم بالإنجليزية"
              value={flag.name_en}
              dir="ltr"
            />
            <FeatureFlagDetailRow
              label="الحالة"
              value={<FeatureFlagStatusBadge isEnabled={flag.is_enabled} />}
            />
          </>
        ) : (
          <p className="py-10 text-center text-gray">
            تعذر تحميل تفاصيل الميزة.
          </p>
        )}
      </div>
    </Modal>
  );
}

export default FeatureFlagDetailsModal;
