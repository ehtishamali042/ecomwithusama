# Design Component Library

**shadcn/ui** will be used as the primary design component library for this dashboard project.

- Built on top of Radix UI primitives for accessibility and composability.
- Integrates seamlessly with Tailwind CSS for styling and customization.
- Fast, modern, and minimal—ideal for admin dashboards.
- Components are copy-paste and customizable, so you can keep your codebase lean.

**Why shadcn/ui?**

- Modern look and feel, with a focus on accessibility.
- Works perfectly with Tailwind CSS utility classes.
- Easy to extend or override styles as your dashboard grows.

**Setup:**

- Install shadcn/ui and its peer dependencies (see official docs for latest commands).
- Use the CLI to add components as needed (e.g., `npx shadcn-ui@latest add button`).
- Customize components in your `/components` folder as your design evolves.

---

## React Query Structure

- Create a `/react-query` folder at the root of your project.
- Inside `/react-query`, create `/queries` and `/mutations` subfolders.
- Place all `useQuery` hooks in `/react-query/queries` and all `useMutation` hooks in `/react-query/mutations`, grouped by domain (e.g., `auth.ts`, `dashboard.ts`).
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

// /react-query/queries/dashboard.ts
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/dashboardApi';

export function useDashboardStats() {
return useQuery(['dashboardStats'], getDashboardStats);
}

```

---
```

**authApi.ts**

```ts
import fetcher from "./fetcher";

export const login = (data) => fetcher.post("/auth/login", data);
export const register = (data) => fetcher.post("/auth/register", data);
// ...other auth endpoints
```

---

## React Query Structure

- Place React Query data hooks (useQuery, useMutation, etc.) in each feature folder (e.g., `/features/auth/useData.ts`).
- Each hook uses the relevant API function from `/api`.
- Use `useQuery` for GET/fetch, `useMutation` for POST/PUT/DELETE.

**Example:**

```ts
// /features/auth/hooks.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/authApi";

export function useLogin() {
  return useMutation(login);
}
```

---

# Dependency Details

**Key Libraries:**

- **React Query** (`@tanstack/react-query`): For data fetching, caching, and server state. Place feature-specific hooks in each feature folder (e.g., `/features/auth/hooks.ts`).
- **Zustand** (`zustand`): For client state management. Place all stores (global and feature-specific) in the `/store` folder (e.g., `/store/authStore.ts`, `/store/dashboardStore.ts`).
- **Tailwind CSS** (`tailwindcss`): For utility-first styling. Global config in `/styles`.
- **Shadcn/ui**: For modern, accessible UI components. Use in `/components` or feature components.
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
- **DTO-driven types for API consistency.**

---

This structure ensures your project is scalable, maintainable, and easy to work with as it grows.
