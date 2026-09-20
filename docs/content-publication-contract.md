# Content publication and consumption contract

This contract covers admin-managed slides and static pages consumed by the Rider and Merchant applications. The backend is the authority for publication state, tenant isolation, audience filtering, locale selection, effective time, versions, rollback, and cache invalidation. Client-side filtering is presentation only and must never be treated as an access-control boundary.

## Admin response envelope

Every slide and static-page response should include a `publication` object:

```json
{
  "publication": {
    "status": "published",
    "audiences": ["rider", "merchant"],
    "tenant": "sa",
    "locales": ["ar", "en"],
    "effective_at": "2026-09-20T18:00:00Z",
    "version": 4,
    "published_at": "2026-09-20T18:00:02Z",
    "propagated_at": "2026-09-20T18:00:08Z",
    "error": null,
    "consumers": {
      "rider": {
        "status": "current",
        "version": 4,
        "refreshed_at": "2026-09-20T18:00:05Z",
        "error": null
      },
      "merchant": {
        "status": "current",
        "version": 4,
        "refreshed_at": "2026-09-20T18:00:08Z",
        "error": null
      }
    }
  }
}
```

Supported publication statuses are `draft`, `scheduled`, `publishing`, `published`, `failed`, and `rolled_back`. Consumer statuses are `pending`, `current`, `stale`, and `failed`. Timestamps must be ISO 8601 values with `Z` or an explicit offset. Versions are immutable and increase for every publish or rollback event.

Older backend deployments may omit `publication`; the dashboard displays that metadata is unavailable and continues to support the existing edit flow.

## Admin commands required from the backend

The frontend must not simulate publishing or rollback by changing `active`, editing timestamps, or restoring cached content. The backend should provide equivalent authenticated, tenant-scoped commands for both resource types:

- `POST /slides/{id}/publish`
- `POST /pages/{uuid}/publish`
- `GET /slides/{id}/versions`
- `GET /pages/{uuid}/versions`
- `POST /slides/{id}/rollback`
- `POST /pages/{uuid}/rollback`

Publish requests should accept `audiences`, `locales`, and `effective_at`, plus an idempotency key. Rollback requests should accept the immutable target `version` and an idempotency key. A successful command should return the updated resource and publication envelope. A partial propagation failure should not be reported as full success; return the affected consumer status and a retry-safe error.

The existing `active` slide field controls whether a slide participates in content. It is not a substitute for publication status.

## Rider and Merchant read APIs

The application-facing APIs must select content using the authenticated tenant, the calling application audience, requested locale, and server time. They must never accept a tenant or audience from an untrusted content payload.

Each response must include:

- `version`: the published immutable content version.
- `tenant`: the resolved tenant.
- `audience`: the resolved application audience.
- `locale`: the resolved locale.
- `published_at` and `effective_at`.
- `ETag` or an equivalent version token suitable for conditional refresh.

Only effective `published` content may be returned. Draft, failed, expired, future-scheduled, other-audience, and other-tenant records must be excluded on the server. Locale fallback, if supported, must be explicit in the response rather than silently changing languages.

## Cache and failure behavior

Publishing, updating, or rolling back must invalidate every cache key containing the resource, tenant, audience, or locale. Consumer APIs should use a bounded cache lifetime and version/ETag revalidation. The agreed propagation target must be monitored from publish acceptance until all intended consumers report the requested version.

If media is missing, the read API should return either a valid fallback URL or a structured media error while preserving the remaining content. The dashboard renders a local unavailable-image fallback when a slide URL is empty or fails to load.

The backend must log publication id, resource id/type, tenant, audiences, locales, requested version, effective time, result, duration, and per-consumer failure. Alerts should cover failed publications and consumers remaining stale beyond the propagation target.

## Verification matrix

Automated integration tests must cover initial publish, update, scheduled activation, rollback, locale selection/fallback, Rider/Merchant audience isolation, tenant isolation, cache refresh, missing media, partial propagation failure, and concurrent/idempotent publish requests.

Staging sign-off requires publishing one slide and one static-page update for each intended audience, recording the returned version, and confirming that the Rider and Merchant APIs and applications show exactly that version within the agreed propagation target. Evidence should include timestamps, tenant, locale, audience, API response version, and application screenshots.
