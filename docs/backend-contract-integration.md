# Backend contract integration

This dashboard treats the supplied Admin EV Share documents as API contracts. It does not
treat operational runbooks or sample local evidence as proof that staging or production is
healthy.

## Integrated frontend behavior

- Authentication branches on stable `code` / `error_code` values. A `401` clears the local
  session; a `403` preserves it and renders the appropriate account, tenant, role, or
  permission denial. OTP expiry, retry exhaustion, and resend throttling have distinct UI
  behavior.
- Tenant identity is persisted separately from the bearer token and sent on every backend
  request. Login verifies that the returned tenant matches the selected country.
- Permission gates use the split sensitive permissions, while the backend remains the
  authority for every action.
- Vehicle commands submit to `/vehicles/{vehicle}/commands`, keep an idempotency key across
  an uncertain retry, poll the command resource, and only report physical success when the
  device acknowledgment confirms it.
- Trip end/cancel requests include the reason and idempotency key in the request body and
  header. The UI reports success only for `COMPLETED`; queued, device-pending, compensated,
  failed, and reconciliation states are not presented as completion.
- Active-trip lists and active trip details poll so lock-close completion is reflected without
  an operator refresh. If a trip completes while an End/Cancel confirmation is open, the stale
  action is dismissed. Trip details render `end_source` and `lock_closed_at` when supplied.
- Refund, pricing configuration, content publication, and feature-flag version/rollback
  endpoints have typed query and mutation boundaries. Existing receipt-refund compatibility
  calls remain in place until that backend surface is retired.
- Settings use the documented catalog types and limits. Boolean, enum, integer, decimal,
  CSV-decimal, phone, email, HTML, and string settings no longer share one numeric input
  policy.
- Money rendering respects the record currency and configured minor units rather than a
  hard-coded tenant currency.
- Deleted users render the original mobile supplied by the API in list, detail, export, and
  embedded-user contexts. Unrecoverable legacy deletions render an unavailable marker; the
  dashboard never parses a storage tombstone to guess a number. Mobile search and export keep
  using the users endpoint query so the backend applies deleted-mobile matching consistently.
- User details consume the October 2026 subscription contract. The UI renders the derived
  `subscription_status`, base and calculated expiry, valid and reversed bonus counts, enrollment
  state, and the complete `subscription_extensions` audit history. The current
  `subscription_summary.ends_at` is presented as authoritative; grant-time date snapshots are
  explicitly described as historical. The legacy `subscription` start/end fields remain as a
  rollout fallback when the additive summary fields are absent.
- The October 2026 cleanup is treated as a backend operation, not a dashboard command. Empty
  module responses remain valid and retained payment operations render safely when their deleted
  order leaves `payable: null`. See [the cleanup integration note](./data-cleanup-2026-10.md).

## Verification boundary

The supplied documents contain a rollout overlap: the generated authorization matrix lists
the legacy singular vehicle route and `Admin Command Vehicles`, while the asynchronous
device-command contract defines the plural command resource and `Admin Send Vehicle
Commands`. The dashboard uses the asynchronous resource and accepts either permission slug
for rendering during migration. Server authorization remains decisive; the backend should
regenerate its matrix once the new route is deployed. The legacy order receipt refund flow
has the same overlap with the newer generic `/refunds` workflow, so both service boundaries
are retained without silently changing the existing operator decision UI.

`authorization_probe_local_e2e.md` is local sample evidence only. Production readiness still
requires the authorization probe and the payment, refund, device, and trip staging checks to
run against the target tenant databases and real provider/device integrations. Those checks
cannot be established by this frontend repository alone.

The lock-close guide states that `GET /admin/v1/trips` and `GET /admin/v1/trips/{uuid}` do not
yet serialize `end_source` or `lock_closed_at`. Their dashboard fields are therefore optional and
forward-compatible; backend exposure is still required before operators can see completion
provenance and the normalized lock-close time.
