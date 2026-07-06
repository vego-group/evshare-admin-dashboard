import type { TripListItem } from "@/types";
import { formatDate } from "../utils";

function TripTimeline({ timeline }: { timeline: TripListItem["timeline"] }) {
  if (!timeline.length) {
    return (
      <section>
        <h3 className="mb-3 font-semibold text-secondary">الجدول الزمني</h3>
        <p className="text-sm text-gray">لا توجد أحداث مسجلة لهذه الرحلة</p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-3 font-semibold text-secondary">الجدول الزمني</h3>
      <ol className="space-y-4 border-r-2 border-primary/20 pr-4">
        {timeline.map((item, index) => (
          <li key={`${item.event}-${index}`} className="relative">
            <span className="absolute right-[-1.35rem] top-1.5 size-2.5 rounded-full bg-primary" />
            <p className="text-sm font-medium text-secondary">{item.event}</p>
            <p className="text-xs text-gray" dir="ltr">{formatDate(item.timestamp)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TripTimeline;
