# Admin feature-flag consumer contract

The Admin frontend consumes an atomic, server-evaluated flag snapshot. It does
not download audience rules, user attributes, tenant rules, or application
version constraints. Authorization and security-sensitive enforcement remain
backend responsibilities.

## Evaluation request

Authenticated clients call:

```http
GET /feature-flags/evaluations?application=admin&platform=web&application_version=1
Authorization: Bearer <token>
X-Tenant-Id: sa
```

The browser calls this through `/api/admin`. The proxy derives the bearer token
and tenant from HTTP-only cookies; browser code cannot select another tenant.
The backend must derive the user/audience from the token and reject a mismatch
between the authenticated tenant and `X-Tenant-Id`.

## Evaluation response

```json
{
  "error": false,
  "message": "",
  "data": {
    "application": "admin",
    "platform": "web",
    "application_version": 1,
    "tenant": "sa",
    "configuration_version": "43",
    "published_at": "2026-09-21T11:59:55.000Z",
    "evaluated_at": "2026-09-21T11:59:58.000Z",
    "expires_at": "2026-09-21T12:01:00.000Z",
    "flags": {
      "new-dashboard": true
    }
  }
}
```

`flags` is the complete evaluated snapshot for this consumer. A rollback is a
new `configuration_version` containing the restored values; version identifiers
must remain unique and must not be reused. The client swaps the entire snapshot
and never merges versions.

The backend must return `Cache-Control: private, no-store` and must not include
targeting rules or flags outside the authenticated tenant. `expires_at` defines
the maximum stale-cache window and should be later than `evaluated_at` by the
agreed propagation SLA.

## Frontend behavior

- The query cache key includes tenant, user ID, and application version.
- `application_version` is a positive integer build number configured through
  `NEXT_PUBLIC_APP_BUILD_NUMBER`; it is not the semantic display version.
- The client polls every 30 seconds and refreshes on focus and reconnect.
- Missing flags default to `false` unless the call site explicitly supplies a
  reviewed safe default.
- Invalid, expired, cross-tenant, wrong-platform, or wrong-version snapshots are
  discarded in full.
- A temporary refresh failure may continue using the last valid unexpired
  snapshot. After expiry, safe defaults are used.
- Login, logout, unauthorized-session cleanup, and tenant changes clear all
  user-scoped browser query data and flag metadata.
- Subsequent Admin API requests report `X-Feature-Flag-Version`,
  `X-Feature-Flag-Evaluated-At`, and `X-Feature-Flag-Received-At`. The backend
  can correlate these with `published_at` to report consumer propagation lag.

Use `useFeatureFlagsContext().isEnabled(key, safeDefault)` for conditional
logic, or the `FeatureFlag` component for rendering. A UI flag never replaces a
permission check or backend authorization.

## Staging verification

For each affected consumer, record the tenant, user/audience, application
version, configuration version, publish time, first observed time, and result.
Verify enable, disable, targeting exclusion, missing flag, temporary evaluation
failure, expiry, rollback, and a request from a second tenant. The Admin client
is ready for this verification once the backend endpoint above is available.
