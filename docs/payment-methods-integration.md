# Payment methods dashboard integration

The payment-methods dashboard follows the current backend contract documented in
`payment_methods.md` (2026-10-07). The older `payment_methods_filtering.md` contract is
superseded and its `allowed_user_types` field must not be sent by this screen.

## Supported behavior

- List methods with pagination, search, `status`, and `available_for` filters.
- Show global statistics independently from the current page and filters.
- Prefer the current `statistics` object. For compatibility only, the list also
  accepts the superseded `analysis` shape with `merchant` and `driver` counts
  and labels them explicitly as gateway counts. It does not send these values
  in filters or mutation payloads.
- Display the method's backing gateway and warn when that gateway is inactive.
- Edit localized names, active state, and one or more checkout contexts.
- Send partial updates to `PUT /payment-methods/{id}`.
- Refresh list statistics and method details after a successful update.

`available_for` accepts `orders` and `subscriptions`. The edit form requires at least
one value because the backend rejects an empty array. User-role availability belongs to
the retired write contract and is intentionally absent from filters and payload types.

## Failure and empty states

List and detail requests expose a retry action instead of leaving the screen in a
loading state. Empty filtered results tell the administrator to adjust or clear filters;
an unfiltered empty list indicates that no methods have been configured for the country.

## Verification

Run:

```powershell
pnpm.cmd exec vitest run tests/unit/payment-methods-api.test.ts tests/unit/payment-methods-form.test.ts tests/unit/payment-methods-statistics.test.ts
pnpm.cmd typecheck
```
