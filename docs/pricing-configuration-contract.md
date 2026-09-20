# Pricing configuration frontend contract

The admin dashboard edits pricing inputs, but the backend remains authoritative for precedence, activation, propagation, calculations, and historical snapshots. The frontend must never reproduce those rules to decide a customer or partner amount.

## Sources and expected precedence

The backend must publish the final precedence order. Until then, the dashboard treats the following as independent configuration sources and does not infer which one wins:

1. Vehicle-level prices and vehicle/operating-company commission overrides.
2. Driver trip and wallet pricing settings.
3. Commission settings.
4. Promotion codes.
5. Automatic subscription discounts.
6. VAT and other financial configuration.

For every resolved quote, order, trip, commission, and settlement, the backend response should include the selected source identifiers and `configuration_version`. If multiple sources contributed, return either a composite version or a structured list of source versions.

## Read response metadata

Pricing resources may include these backward-compatible fields:

| Field | Meaning |
| --- | --- |
| `configuration_version` | Immutable version used by transactional services. Preferred over the legacy `version` alias. |
| `tenant` | Tenant identifier that owns the configuration. |
| `currency` | ISO 4217 code for monetary values. |
| `effective_at` | Inclusive activation timestamp in ISO 8601 with an offset or `Z`. |
| `expires_at` | Exclusive expiry timestamp in ISO 8601 with an offset or `Z`. |
| `propagation_status` | `pending`, `propagating`, `propagated`, `failed`, or `stale`. |
| `propagated_at` | Time all required consumers acknowledged the version. |
| `propagation_lag_ms` | Milliseconds from acceptance to the last required acknowledgement. |
| `updated_at` | Last configuration update timestamp. |
| `updated_by` | Administrator/audit actor identifier. |

The dashboard displays metadata when supplied and stays compatible with endpoints that do not supply it yet. A successful write means the backend accepted the change; it does not prove propagation unless `propagation_status` is `propagated`.

## Write behavior

- The selected tenant is sent by the server layer in `X-Tenant-Id`; payload tenant values must not override it.
- Date-only promotion and discount fields are labelled as tenant time. The backend must resolve them using the tenant timezone and return unambiguous ISO 8601 timestamps.
- Active commission, promotion, discount, and driver-pricing changes require explicit user confirmation.
- The submit action remains disabled while pending, preventing accidental duplicate submissions.
- API validation and propagation errors must be returned as actionable messages. Conflict responses should identify overlapping rules and their versions.
- After a successful pricing write, the dashboard invalidates pricing, vehicle, trip, and order queries so visible derived amounts are re-fetched.

## Historical transaction contract

Transactional responses must return an immutable pricing snapshot. At minimum this includes currency, component amounts, tax inputs, commission inputs, discounts/promotions, `configuration_version`, tenant, and the time pricing was locked. Later configuration edits or rollback must never alter this snapshot.

Trip details currently display `configuration_version`, `tenant`, `effective_at`, and `pricing_locked_at` when returned in the `pricing` snapshot. The same convention should be used for quote, order, commission, and settlement detail endpoints.

## Backend endpoints still required

The current frontend repository has no contract for configuration history, explicit rollback, propagation acknowledgement details, or an authoritative pricing-preview endpoint. These must be added by the backend before the dashboard can safely expose those actions. Do not implement rollback or preview as client-side calculations.

Recommended additions:

- `GET /pricing-configurations/{source}/{id}/versions`
- `POST /pricing-configurations/{source}/{id}/rollback` with the target version and an idempotency key
- `GET /pricing-configurations/{source}/{id}/propagation`
- `POST /pricing/preview` returning the resolved source/version breakdown

## Verification scenarios

Contract and staging tests should cover immediate and scheduled activation, overlap precedence, expiry, rollback, tenant and currency isolation, delayed/failed propagation, stale consumers, and immutability of historical quote/order/trip/settlement snapshots.
