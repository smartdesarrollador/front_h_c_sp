# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 5175 (proxies /api → localhost:8000)
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build

# Quality
npm run lint         # ESLint (max-warnings 0 — any warning fails)
npm run format       # Prettier formatting
npm run typecheck    # TypeScript check (no emit)
npm run test         # Vitest unit tests
npm run coverage     # Vitest with coverage (thresholds: 65% lines, 55% branches)
```

To run a single test file:
```bash
npx vitest run src/features/auth/__tests__/LoginPage.test.tsx
```

## Architecture

**React 18 + TypeScript + Vite** — Hub Client Portal (multi-tenant SaaS entry point for customers).

### State Management

Hybrid approach:
- **Zustand** (`src/store/`) — persistent global state: `authStore` (user, tenant, accessToken, isAuthenticated) and `uiStore` (darkMode, language)
- **React Context** — `AuthContext` (`src/features/auth/AuthContext.tsx`) wraps the app for auth side-effects (init token refresh on mount, exposes `login`/`logout`/`register`)
- **TanStack Query** — all server state; configured in `src/lib/queryClient.ts` (5min stale time, 1 retry)

### API Clients (`src/lib/axios.ts`)

Two Axios instances — both point to `VITE_API_URL/api/v1`:
- **`apiClient`** — injects `Authorization: Bearer` header; handles 401 by calling `/auth/token/refresh/`, retrying the original request, and on failure clearing auth + redirecting to `/login`
- **`publicClient`** — no auth headers; used for login, register, token refresh, password reset

**Note:** `src/lib/api.ts` is legacy and unused — always import from `src/lib/axios.ts`.

### Routing (`src/router/index.tsx`)

React Router 7. All page components are lazy-loaded. Structure:
```
/                           → Landing
/login, /register, etc.     → Public auth pages (AuthLayout)
<ProtectedRoute>            → Checks isAuthenticated from Zustand
  <AppLayout>               → Navbar + <Outlet>
    /dashboard, /services, /subscription, /billing, /team, /support, /notifications, /profile
```

`ProtectedRoute` reads from Zustand (not Context) and redirects to `/login` if unauthenticated.

### Feature Structure (`src/features/`)

Each feature contains: `hooks/`, `components/`, `types.ts`, optional `__tests__/`. Features never import from each other — shared logic goes in `src/hooks/` (global) or `src/types/`.

Key global hooks:
- `useFeatureGate()` — plan feature flags + limits from `/features/` endpoint
- `usePermissions()` — role/permission checking for the current user

### SSO Flow

```
useSSO hook → POST /auth/sso/token/ { service: "workspace" }
           → { sso_token, redirect_url }
           → window.location.href = redirect_url
```

Tokens are single-use with 60s TTL; validated by destination service.

### Auth Persistence

- Refresh token: `localStorage.hub-refreshToken`
- User: `localStorage.hub-authUser`
- Tenant: `localStorage.hub-authTenant`
- Theme: `localStorage.hub-theme`
- Language: `localStorage.hub-lang`

### i18n (`src/i18n/`)

Spanish (`es`) is default + fallback; English (`en`) also supported. Translations are namespace-based (one namespace per feature). Usage: `const { t } = useTranslation('dashboard')`.

### Testing

- **Vitest** + **Testing Library** + **MSW** for API mocking (`src/test/handlers/`)
- **jest-axe** for accessibility assertions (`src/test/a11y/`)
- Test setup: `src/test/setup.ts`

### Environment Variables

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Hub Client Portal
VITE_REFERRAL_BASE_URL=https://app.rbacplatform.com/register?ref=
```

All accessed via `import.meta.env.VITE_*`.

### Tailwind & Dark Mode

Dark mode is class-based (Tailwind). `uiStore.toggleDarkMode()` toggles the `dark` class on `document.documentElement` and persists the preference. Always provide both light and dark variants for background/text colors.
