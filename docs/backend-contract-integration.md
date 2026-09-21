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
- Refund, pricing configuration, content publication, and feature-flag version/rollback
  endpoints have typed query and mutation boundaries. Existing receipt-refund compatibility
  calls remain in place until that backend surface is retired.
- Settings use the documented catalog types and limits. Boolean, enum, integer, decimal,
  CSV-decimal, phone, email, HTML, and string settings no longer share one numeric input
  policy.
- Money rendering respects the record currency and configured minor units rather than a
  hard-coded tenant currency.

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
