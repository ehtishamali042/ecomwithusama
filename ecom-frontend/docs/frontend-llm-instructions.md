# Design Component Library

**daisyUI + Tailwind CSS** are used as the primary UI foundation for this dashboard project.

- Built on top of Tailwind CSS utility classes, with ready‑made components.
- Provides modern, accessible defaults that are easy to customize.
- Works nicely with lightweight wrapper components (Button, Card, Input) in the `src/components/ui` folder.

**Why daisyUI?**

- Simple, clean admin‑friendly design with minimal setup.
- Themeable via Tailwind config (light/dark, brand colors, etc.).
- Lets you combine utility classes and prebuilt component styles for fast iteration.

**Setup:**

- Install and configure `tailwindcss` and `daisyui` (see official docs for the latest commands).
- Enable `daisyui` as a Tailwind plugin in `tailwind.config.js`.
- Use daisyUI classes (e.g. `btn`, `card`, `alert`, `badge`, `table`, `bg-base-200`) directly in feature components, optionally wrapped by shared UI components in `src/components/ui`.

---

## React Query Structure

- Use a `/react-query` folder at the root of the project.
- Inside `/react-query`, use `/queries` and `/mutations` subfolders.
- Place all `useQuery` hooks in `/react-query/queries` and all `useMutation` hooks in `/react-query/mutations`, grouped by domain (e.g., `auth.ts`, `dashboard.ts`, `stocks.ts`).
- Each hook imports its API function from `/api`.

**Example:**

```ts
// /react-query/mutations/auth.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/authApi";

export function useLogin() {
  return useMutation(login);
}
```

```ts
// /react-query/queries/dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboardApi";

export function useDashboardStats() {
  return useQuery(["dashboardStats"], getDashboardStats);
}
```

---

# Dependency Details

**Key Libraries:**

- **React Query** (`@tanstack/react-query`): For data fetching, caching, and server state. Place feature-specific hooks in each feature folder (e.g., `/features/auth/hooks.ts`).
- **Zustand** (`zustand`): For client state management. Place all stores (global and feature-specific) in the `/store` folder (e.g., `/store/authStore.ts`, `/store/dashboardStore.ts`).
- **Tailwind CSS** (`tailwindcss`): For utility-first styling. Global config in `/styles`.
- **daisyUI** (`daisyui`): For modern, accessible UI components built on Tailwind. Use classes directly in feature components, optionally wrapped by shared components in `/components/ui`.
- **React Router** (`react-router-dom`): (If used) For routing, with route files in `/pages` or `/routes`.
- **TypeScript**: For type safety. Place global types in `/types`, feature types in feature folders.

dto.ts

# Frontend LLM Instructions (Vite + React)

> **Goal:** Build a scalable, maintainable admin portal using Vite + React + TypeScript. Use modular code, clear separation of concerns, and best practices for lazy loading and code organization. Integrate with the NestJS backend for authentication and admin features.

## Overview

This portal is for e-commerce inventory management. For Phase 1, focus on authentication and dashboard sign-in. The frontend communicates only with the NestJS backend (no direct Supabase calls).

---

## Modern Folder Structure & Routing Pattern

- The `/pages` (or `/routes`) folder is only for routing. Each file here defines a route and simply imports and renders the main screen/component from a feature or section folder.
- All business logic, UI, hooks, and state for a screen live in the feature/section folder, not in `/pages`.
- This keeps routing clear and lets you organize features/screens however you want, without cluttering the routing layer.

### Example folder structure

```
 /src
   /api                // grouped API logic
     authApi.ts
     dashboardApi.ts
     productsApi.ts
     fetcher.ts
   /react-query
     /queries          // useQuery hooks grouped by domain
       auth.ts
       dashboard.ts
       products.ts
     /mutations        // useMutation hooks grouped by domain
       auth.ts
       dashboard.ts
       products.ts
   /pages (or /routes)
     dashboard.tsx         // Just imports and renders DashboardScreen
     auth/
       login.tsx           // Just imports and renders LoginScreen
       register.tsx
     products/
       index.tsx
       ...
   /features (or /modules)
     /dashboard
       DashboardScreen.tsx
      // (no useData.ts here; use /react-query/queries/dashboard.ts and /react-query/mutations/dashboard.ts)
       utils.ts
       styles.ts
       types.ts
       components/
         StatsCard.tsx
         LogoutButton.tsx
     /auth
       LoginScreen.tsx
       RegisterScreen.tsx
      // (no useData.ts here; use /react-query/queries/auth.ts and /react-query/mutations/auth.ts)
       utils.ts
       styles.ts
       types.ts
       components/
         LoginForm.tsx
         RegisterForm.tsx
     /products
       ProductsScreen.tsx
       hooks.ts
       ...
   /components      // global, reusable UI (Button, Modal, etc.)
   /hooks           // global hooks
   /utils           // global utils
   /types           // global types
   /store           // all Zustand stores (e.g., authStore.ts, dashboardStore.ts, uiStore.ts)
   /styles          // global styles (tailwind, etc.)
```

---

## Example: Route File (Thin Page)

```tsx
// /pages/dashboard.tsx
import DashboardScreen from "../features/dashboard/DashboardScreen";
export default DashboardScreen;
```

---

## Best Practices

- **/pages is for routing only.** Each file should be a thin wrapper that imports the real screen/component from a feature folder.
- **Colocate hooks, utils, styles, and types with each feature/screen.**
- **Group related subpages in subfolders.**
- **Keep global folders minimal.** Only use `/components`, `/hooks`, `/utils`, `/types`, `/store` for code shared across multiple features.
- **Use React.lazy and Suspense for lazy loading.** Code split at the feature or section level for performance and maintainability.
- **Keep API logic close to the feature.** Each feature manages its own API calls and mutations unless shared globally.
- **Use Tailwind and Shadcn/ui for all styling.**
- **Use Tailwind and daisyUI for all styling.**
- **DTO-driven types for API consistency.**

---

## Stocks Frontend Module

The Stocks feature should follow the same patterns as `auth` and `dashboard`:

- Routes live under `src/pages/dashboard/stocks` as thin wrappers.
- Real screens, UI, and logic live in `src/features/stocks`.
- Stock data fetching and mutations live in `src/react-query/queries/stocks.ts` and `src/react-query/mutations/stocks.ts`, calling `src/api/stocksApi.ts`.
- Styling uses Tailwind + daisyUI classes, consistent with the rest of the dashboard.

For a detailed spec of the Stocks CRUD UI (routes, screens, API integration, and daisyUI layout guidance), see `docs/stock-frontend-llm-instructions.md`.

---

This structure ensures your project is scalable, maintainable, and easy to work with as it grows.
