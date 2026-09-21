# EVShare Admin Dashboard test strategy

## Scope and test layers

The test commands are intentionally split by speed and environment risk.

| Requested test type | Automated coverage in this repository | Command / process |
| --- | --- | --- |
| Unit | Schemas, helpers, isolated UI behavior | `pnpm test:unit` |
| Integration | Browser data layer + same-origin gateway behavior | `pnpm test:unit`, `pnpm test:api` |
| System | Built application plus browser suites | `pnpm build`, `pnpm test:e2e` |
| Functional | Login validation, country selection, session expiry | `pnpm test:e2e` |
| UI | DOM roles, controls, responsive behavior, screenshots | `pnpm test:e2e` |
| API | Gateway auth/status/body contracts; live staging APIs are gated | `pnpm test:api` |
| Database | Backend-owned; execute the checklist below against an isolated test database | Backend CI / DBA runner |
| Regression | Unit, contract, E2E and screenshot suites | `pnpm test:all` |
| Smoke | Login and protection of every panel collection route | `pnpm test:smoke` |
| Sanity | Select the affected spec, e.g. `pnpm exec playwright test -g "country picker"` | Per change |
| Acceptance / UAT | Business checklist below and authenticated staging suite | Manual + staging |
| Performance | Safety-gated concurrent load and response-time budget | `pnpm test:performance` |
| Security | Auth boundaries, cookie flags, dependency audit, optional strict headers | `pnpm test:security`, `pnpm test:dependencies` |
| Compatibility | Chromium, Firefox, WebKit, Chrome mobile, Safari mobile profiles | `pnpm test:compatibility` |
| Usability | Moderated task checklist below; automation catches only objective friction | Manual |
| Accessibility | axe WCAG A/AA, semantics, keyboard checks | `pnpm test:accessibility` |
| End-to-end | Anonymous locally; authenticated full-route staging checks when state is supplied | `pnpm test:e2e` |

## Normal workflows

Fast local validation:

```powershell
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
```

Install browser engines once:

```powershell
pnpm.cmd exec playwright install
```

Run Chromium locally:

```powershell
pnpm.cmd test:e2e
```

Run every configured desktop and mobile browser:

```powershell
pnpm.cmd test:compatibility
```

Create or intentionally update the visual baseline:

```powershell
pnpm.cmd test:e2e:update
```

## Authenticated staging and live API boundary

Never target production. Set `PLAYWRIGHT_BASE_URL` to staging and supply a short-lived, least-privilege Playwright storage-state JSON through `PLAYWRIGHT_STORAGE_STATE`. Keep that file outside Git. The authenticated suite skips automatically when state is absent.

OTP automation should use a dedicated staging-only test account and a backend-provided OTP bypass or inbox API. Do not hard-code a real mobile, OTP, access token, or database credential in the repository.

## Performance safety gate

Load tests refuse to start unless both variables are present:

```powershell
$env:PERF_BASE_URL = "https://staging.example.test"
$env:ALLOW_PERFORMANCE_TESTS = "true"
pnpm.cmd test:performance
```

Defaults: 10 connections for 15 seconds, p99 under 1500 ms, under 1% connection errors, and no non-2xx responses. Override with `PERF_CONNECTIONS`, `PERF_DURATION_SECONDS`, or `PERF_P99_LIMIT_MS` only for an approved test environment.

## Database verification checklist

The frontend has no schema, migrations, query layer, or database connection, so database tests belong in the backend repository. Against a disposable database, verify:

- foreign keys reject orphan orders, shipments, payments, trips, users, and tenant-owned records;
- unique keys prevent duplicate idempotency keys, role slugs, feature-flag keys, and normalized tenant phone numbers;
- transaction rollbacks leave financial balances, refunds, VAT, commissions, and wallet ledgers consistent;
- tenant isolation prevents a valid admin from reading or changing another tenant's rows;
- soft-delete, audit, timestamps, currency minor units, and status transitions retain their invariants;
- concurrent commands do not duplicate payments, refunds, exports, device actions, or order transitions;
- backup restore and migration up/down procedures are tested on production-like data volume.

## UAT and usability checklist

Use one admin per role/tenant. Record evidence, actual result, tester, build SHA, browser, and date.

1. Log in by mobile and OTP; verify invalid, expired, throttled, and reused OTP behavior.
2. Confirm each role sees only its allowed navigation and receives a safe denial for forbidden deep links.
3. Create, edit, view, filter, paginate, and delete representative catalog/configuration records.
4. Complete the critical operational flows for users, KYC, orders, shipments, payments, refunds, wallet, fleet, trips, device commands, reports, VAT, and exports.
5. Verify Arabic RTL copy, currency, tenant phone normalization, dates/time zones, loading, empty, validation, offline, 401, 403, 409, 422, 429, and 5xx states.
6. Complete critical tasks using keyboard only and at 200% zoom; verify focus visibility and screen-reader names.
7. Ask representative operators to complete five common tasks without coaching; record completion rate, time, errors, and confusing labels.
8. Obtain product owner, operations, finance, security, and accessibility sign-off before release.

## Release gates

- Every change: lint, typecheck, unit, contract tests.
- Pull request: production build, Chromium smoke/functional/API/accessibility.
- Nightly or release candidate: all browser profiles, visual regression, authenticated staging routes, dependency audit.
- Approved pre-release window: performance, active security scan, database integrity/restore, and UAT.
