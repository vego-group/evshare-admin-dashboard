# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # start dev server (Next.js, http://localhost:3000)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

Package manager is pnpm (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`). There is no test runner configured in this repo.

Requires a `.env` with `NEXT_PUBLIC_API_ADMIN_BASE_URL` and `NEXT_PUBLIC_API_AUTH_BASE_URL` pointing at the backend admin/auth APIs.

## Architecture

This is a Next.js 16 (App Router) admin panel for EVShare, using React 19, TypeScript, Tailwind v4, shadcn/ui (`new-york` style, no RTL despite Arabic content), TanStack Query, react-hook-form + zod, and axios.

### Route groups

- `src/app/(panel)/*` — authenticated admin pages, wrapped by `src/app/(panel)/layout.tsx` (`Sidebar` + `PageShell`). One folder per feature: `cities`, `categories`, `orders`, `payment-methods`, `roles-permissions`, `wallet`, etc. Page files are thin — they just render the matching component from `src/components/panel/<feature>`.
- `src/app/login` — unauthenticated login + OTP verification flow.
- `src/app/api/admin/[...path]/route.ts` — a GET-only proxy: forwards `/api/admin/*` requests to `NEXT_PUBLIC_API_ADMIN_BASE_URL`, attaching the `token` cookie as a Bearer header. This exists so client components can read data without exposing the backend base URL or token. Mutations do **not** go through this proxy — they run as server actions instead (see below).

### Data layer (per-feature, repeated across `cities`, `orders`, `products`, etc.)

- `src/types/<feature>.ts` — response/request shapes for that feature.
- `src/schemas/<feature>.ts` — zod schemas for react-hook-form validation.
- `src/services/queries/<feature>.ts` — read functions. Client-side reads call `baseAPI("GET", url)` (`src/services/index.ts`), which fetches through `/api/admin/*` in the browser and falls back to a direct `adminApi` axios call on the server.
- `src/services/mutations/<feature>.ts` — write functions, marked `"use server"`. These call `safeApi(method, url, payload)` directly against `adminApi` (bypassing the proxy) and always return a normalized `{ ok, status, data|error, message }` (`ApiResult`) instead of throwing — check `.ok` at the call site rather than wrapping in try/catch.
- `src/hooks/api/<feature>.ts` — thin TanStack Query wrappers (`useCustomQuery`/`useCustomInfiniteQuery` from `src/hooks/useCustomQuery.ts`) around the query functions, used by client components.
- `src/data/<feature>.ts(x)` — static config for a feature's UI (e.g. table column defs, filter options), not server data.

When adding a new admin feature, replicate this five-file shape rather than inventing a new pattern.

### Auth

- `src/lib/utils/auth.ts` — server-only helpers (`getToken`/`setToken`/`removeToken`) for the httpOnly `token` cookie. There is no `middleware.ts`; route protection is done per-page/per-API-call by checking the cookie.
- `axios` instances (`adminApi`, `authApi` in `src/services/index.ts`) both attach a 401 interceptor that redirects to `/login?expired=1` client-side; `initApi()` injects the Bearer token into axios defaults for server-side calls.

### Components

- `src/components/panel/<feature>/` — feature UI, generally split into `index.tsx` (composition root), `header/`, `toolbar/` (search/filter), `results/` (table + cards), `pagination/`, `modals/` (add/edit/delete forms), and a `content-shimmer.tsx` loading skeleton.
- `src/components/ui/` — shadcn primitives plus shared building blocks like `page-shell`.
- `src/components/sidebar/` — nav driven by `src/data/sidebar.ts`.

### Path alias

`@/*` maps to `src/*` (see `tsconfig.json`); shadcn aliases (`components.json`) mirror this (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
