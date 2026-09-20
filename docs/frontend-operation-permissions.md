# Admin Dashboard frontend permission contract

The Admin API is the security boundary. These frontend checks only prevent users
from being offered actions that their current role cannot perform. A hidden
button is never a substitute for backend authorization.

| UI operation | Permission slug | Frontend behavior |
| --- | --- | --- |
| Cancel an active trip | `Admin Cancel Trips` | Hide cancel controls |
| End an active trip | `Admin End Trips` | Hide end controls |
| Suspend a user | `Admin Suspend Users` | Hide suspend controls |
| Reactivate a user | `Admin Reactivate Users` | Hide reactivate controls |
| Delete a user | `Admin Delete Users` | Hide delete controls |
| Send a vehicle IoT command | `Admin Command Vehicles` | Hide command controls |
| Generate a report | `Admin Generate Reports` | Disable report generation |
| Download a report | `Admin Download Reports` | Hide download controls and disable automatic downloads |
| Export VAT data | `Admin Export VAT` | Hide export and download controls |
| Add a VAT settlement | `Admin Add VAT Settlements` | Hide the settlement action |

The authenticated permission list is refreshed every 60 seconds and whenever
the browser window regains focus. Successful role-permission mutations also
invalidate the permission query. Regardless of this frontend cache, a backend
role revocation must reject the next forbidden request with HTTP `403` according
to the backend session/cache policy.

All API helper paths show one consistent access-denied notification for `403`
responses. The notification contains no request or response payload data.
