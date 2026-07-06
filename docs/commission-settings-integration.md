# Commission Settings — Frontend Integration

Maps the endpoints in `commission_settings.md` to the files that implement them in this repo, following the standard five-file data-layer shape described in `CLAUDE.md`.

## API → code mapping

| Endpoint | Function | File |
| --- | --- | --- |
| `GET /admin/v1/commission-settings` | `commissionSettingsAPI` | [src/services/queries/commission-settings.ts](../src/services/queries/commission-settings.ts) |
| `GET /admin/v1/commission-settings/{uuid}` | `singleCommissionSettingAPI` | [src/services/queries/commission-settings.ts](../src/services/queries/commission-settings.ts) |
| `POST /admin/v1/commission-settings/create` | `addCommissionSetting` | [src/services/mutations/commission-settings.ts](../src/services/mutations/commission-settings.ts) |
| `POST /admin/v1/commission-settings/{uuid}/edit` | `editCommissionSetting` | [src/services/mutations/commission-settings.ts](../src/services/mutations/commission-settings.ts) |
| `DELETE /admin/v1/commission-settings/{uuid}/delete` | `deleteCommissionSetting` | [src/services/mutations/commission-settings.ts](../src/services/mutations/commission-settings.ts) |

Reads go through `baseAPI` (client → `/api/admin/*` proxy, server → direct `adminApi` call). Writes are server actions (`"use server"`) that call `safeApi` directly against `adminApi` and return a normalized `{ ok, status, data|error, message }` instead of throwing.

## Data layer

- **Types** — [src/types/commission-settings.ts](../src/types/commission-settings.ts): `CommissionSetting`, `CommissionType` (`fixed` | `percentage`), list/detail response shapes, `CreateCommissionSettingPayload` / `UpdateCommissionSettingPayload`.
- **Schema** — [src/schemas/commission-settings.ts](../src/schemas/commission-settings.ts): `commissionSettingSchema` (zod) validates `name_ar`, `name_en`, `type`, `amount` (coerced to a non-negative number), `is_active`.
- **Queries** — [src/services/queries/commission-settings.ts](../src/services/queries/commission-settings.ts).
- **Mutations** — [src/services/mutations/commission-settings.ts](../src/services/mutations/commission-settings.ts).
- **Hooks** — [src/hooks/api/commission-settings.ts](../src/hooks/api/commission-settings.ts): `useCommissionSettings(params)` / `useCommissionSetting(id)` (TanStack Query wrappers via `useCustomQuery`).

All five files are re-exported from their feature barrels (`src/types/index.ts`, `src/schemas/index.ts`, `src/services/queries/index.ts`, `src/services/mutations/index.ts`, `src/hooks/api/index.ts`), so consumers import from `@/types`, `@/schemas/commission-settings`, `@/services/queries`, `@/services/mutations`, `@/hooks/api`.

## UI

`src/components/panel/commission-settings/`, composed the same way as `products`/`payment-methods`:

- `index.tsx` — composition root: loads the list via `useCommissionSettings`, holds add/edit/delete modal state, invalidates the `["commission-settings"]` query key on save/delete.
- `header/index.tsx` — page title + "Add" button, gated behind `Add Commission Settings`.
- `content-shimmer.tsx` — loading skeleton.
- `results/index.tsx` — table (name ar/en, type badge, amount, active badge, edit action gated by `View Commission Settings` + `Edit Commission Settings`, delete action gated by `Delete Commission Settings`).
- `modals/` — `commission-setting-form-modal.tsx` (shared add/edit form), `commission-setting-fields.tsx`, `commission-setting-actions.tsx`, `commission-setting-form-utils.ts` (resolver/defaults/payload builder), `use-commission-setting-form.ts` (react-hook-form wiring + submit), `commission-setting-delete-confirm-modal.tsx`.

Route: [src/app/(panel)/commission-settings/page.tsx](../src/app/(panel)/commission-settings/page.tsx), thin wrapper rendering `<CommissionSettings />`. Sidebar entry added in [src/data/sidebar.ts](../src/data/sidebar.ts) under `Index Commission Settings`.

## Permission slugs

- `Index Commission Settings` — sidebar link + list view
- `Add Commission Settings` — header "add" button
- `View Commission Settings` — used alongside `Edit` to gate the edit action (mirrors the `payment-methods` pattern of requiring show+edit)
- `Edit Commission Settings` — edit action
- `Delete Commission Settings` — delete action

## Notes

- The list endpoint in the doc only documents `limit` (no pagination meta in the sample response), so `CommissionSettingsQueryParams` only exposes `limit` and the list view renders everything returned without a pagination control (unlike `products`/`categories`, which are server-paginated).
