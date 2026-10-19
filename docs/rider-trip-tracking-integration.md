# Rider trip tracking — admin integration

This dashboard consumes the backend trip-tracking contract described in
`rider_trip_tracking_settings.md` without duplicating its GPS validation or exposing its
server environment settings in the admin UI.

## Admin API boundary

- Trip lists and details continue to use `GET /admin/v1/trips` and
  `GET /admin/v1/trips/{uuid}` through `tripsAPI` and `singleTripAPI`.
- The `distance` property is the backend-authoritative travelled distance in kilometres.
  The dashboard formats that value for display and never calculates distance from pickup,
  drop-off, live location, or route points.
- Route points may include `discarded: true`. They remain part of the typed response for
  diagnostics, but do not alter the displayed trip distance.
- `GET /api/v1/driver/trips/{uuid}` is rider-only and is intentionally not called by this
  admin application.

## Configuration boundary

`TRIP_DISTANCE_*` and `RIDER_DISTANCE_*` are backend deployment settings under
`config/trip.php`. They are not tenant-editable admin settings and no dashboard form, schema,
mutation, permission, route, or sidebar item is created for them. Deployment configuration and
validation remain backend/operations responsibilities.

## Code mapping

| Concern | Implementation |
| --- | --- |
| Trip response contract | `src/types/trips.ts` |
| Admin trip queries | `src/services/queries/trips.ts` |
| Query hooks and active-trip refresh | `src/hooks/api/trips.ts` |
| Authoritative distance display | `src/components/panel/trips/view-trip/trip-basic-info.tsx` |
| Distance formatting | `src/components/panel/trips/utils.ts` |
| Contract coverage | `tests/unit/trip-distance.test.ts` |

## Backend acceptance checks

The dashboard cannot verify GPS-source arbitration or filtering itself. Backend integration
tests should prove that trips start at zero, invalid points are marked discarded, vehicle and
rider sources are not mixed while vehicle telemetry is fresh, the stored distance survives an
app restart, and distance stops changing after trip completion.
