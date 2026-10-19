# Rider notifications integration

The backend owns automatic rider notifications. It stores each notification in the rider app's Notification Center and, when permitted, sends it through Firebase Cloud Messaging to every active device registered to that rider.

This is separate from the admin dashboard's Marketing Communications feature. The dashboard must not call Marketing Communications endpoints for automatic trip, wallet, zone, or account events.

## Dashboard responsibilities

- `wallet_low_balance_threshold` remains editable under Driver Pricing & Wallet Settings. The backend uses it for `wallet_low_balance` events during a ride or after a charge.
- `notifications_enabled` remains editable on the user form. It controls push delivery only; turning it off does not stop notifications from being stored.
- Suspending and reactivating an account use the existing account-action endpoints. The backend emits `account_suspended` and `account_reactivated` only after the action commits.
- Ending or cancelling a trip uses the existing idempotent trip endpoints. The backend emits `trip_interrupted`; any resulting wallet charge or refund can emit its own notification.
- Removing a user deletes their registered devices on the backend. There is no separate dashboard device cleanup request.

## Events owned by the backend

`trip_started`, `trip_completed`, `trip_interrupted`, `wallet_deduction`, `wallet_top_up_succeeded`, `wallet_top_up_failed`, `wallet_low_balance`, `wallet_negative_balance`, `refund_completed`, `zone_slow`, `zone_restricted`, `account_suspended`, and `account_reactivated`.

The backend guarantees once-per-event persistence, sends pushes only after commit, and does not fail the business action when Firebase delivery fails. The dashboard should therefore report the result of the business action, not claim that a push reached a device.

## Unsupported admin UI

There is currently no admin endpoint for listing rider notifications, inspecting devices, retrying a push, or viewing Firebase delivery logs. Do not add an admin Notification Center until a documented API exists.

For support investigations, backend operators should check the `notifications` row, the user's `notifications_enabled` value, active `user_devices`, and the `fcm_send_failed` or `notification_push_failed` logs.
