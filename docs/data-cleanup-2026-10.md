# October 2026 data cleanup: dashboard integration

The supplied cleanup document describes a one-off backend operation. It is not a dashboard
endpoint and the dashboard must not attempt to start, schedule, or validate the deletion.
The backend team runs it per country database after a dry run, review, and backup.

## Expected post-cleanup state

| Dashboard area | Expected result |
| --- | --- |
| Orders | Empty, except for orders created after that country's cleanup starts. |
| Registration requests (KYC) | Requests created at or after `2026-09-30 00:00:00`. |
| Consultation requests | Requests created at or after `2026-09-30 00:00:00`. |
| Withdrawal requests | Empty. |
| Complaints | Exactly the latest non-deleted complaint. |
| Payment verification operations | Records created at or after `2026-08-30 00:00:00`, plus any older records required by an unfinished refund. |
| Payment transactions | Records created at or after `2026-08-30 00:00:00`, plus any older records required by an unfinished refund. |
| Vehicles | Retained with owner, product/type, and pricing; the deleted order-item link may be empty. |
| Wallet | Ledger rows and balances remain unchanged. |

The cutoff is inclusive and uses the timezone in which backend records are stored.

## Frontend contract

- Empty collection responses are valid states, not cleanup failures.
- A retained payment checkout can have `payable: null` after its order is deleted. The payment
  operations list and details panel render that state as an unavailable reference while keeping
  the financial record visible.
- A retained payment transaction can contain a checkout whose `payable` is `null`.
- Vehicle `order_item_id` remains optional. Vehicle product, type, pricing, and owner data do not
  depend on the order relation after the backend migration.
- User, merchant, rider, role, permission, product, category, payment-method, gateway,
  subscription, and wallet-top-up screens are not filtered by this operation.
- No client-side date filtering is added. The API response is authoritative, including the
  unfinished-refund exception.

## Operational boundary

Before production execution, operators still need to decide whether approved KYC records before
the cutoff may be removed and whether payments for deleted orders should also be removed. Those
are backend run parameters, not frontend feature flags.

Production readiness requires the backend dry-run report, backup/snapshot evidence, automatic
validation, and a manual load check of Orders, Complaints, Consultations, Withdrawal Requests,
Registration Requests, both Payment Operations tabs, and Vehicles for every country database.
