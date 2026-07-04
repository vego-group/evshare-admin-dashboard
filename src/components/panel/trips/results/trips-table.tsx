import type { ReactNode } from "react";
import { Eye } from "lucide-react";

import type { TripListItem } from "@/types";
import { formatDate, tripDriverName, tripVehicleTitle } from "../utils";
import TripStatusBadge from "./trip-status-badge";

type Props = {
  trips: TripListItem[];
  onView: (trip: TripListItem) => void;
};

const headers = ["رقم الرحلة", "الحالة", "السائق", "المركبة", "وقت البدء", "وقت الانتهاء", "الإجراءات"];

function TripsTable({ trips, onView }: Props) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              {headers.map((h) => <HeaderCell key={h}>{h}</HeaderCell>)}
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="text-dark-gray">
                <TableCell dir="ltr">{trip.id.slice(0, 8)}</TableCell>
                <TableCell truncate={false}><TripStatusBadge status={trip.status} /></TableCell>
                <TableCell>{tripDriverName(trip.driver)}</TableCell>
                <TableCell>{tripVehicleTitle(trip.vehicle)}</TableCell>
                <TableCell dir="ltr">{formatDate(trip.date_time.start)}</TableCell>
                <TableCell dir="ltr">{formatDate(trip.date_time.end)}</TableCell>
                <TableCell truncate={false}>
                  <button
                    type="button"
                    aria-label="عرض"
                    onClick={() => onView(trip)}
                    className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:brightness-95"
                  >
                    <Eye className="size-4" />
                  </button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default TripsTable;
