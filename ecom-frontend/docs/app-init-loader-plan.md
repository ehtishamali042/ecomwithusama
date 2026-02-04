# App Initialization Loader Plan

## Background

- `src/App.tsx` mounts the router and immediately calls `useInitUser().initUser()` to fetch the authenticated profile if a valid token exists.
- `useInitUser` (see `src/hooks/useInitUser.tsx`) fires a `getMe` query via React Query and writes the resulting user object into the persisted Zustand `useAuthStore` defined in `src/store/authStore.ts`.
- `MainRoutes` (`src/pages/MainRoutes.tsx`) currently renders its lazy routes inside a `Suspense` boundary whose fallback is a static "Loading..." `div`. Route guards rely on `useUser`, which simply reads from the auth store.
- Because `initUser` runs asynchronously, there is a brief interval during which the auth store has no user yet even if the browser already holds a valid token. During that interval, the routing layer treats the visitor as unauthenticated, so the UI can flicker between `/login` and the eventual protected area.

## Goal

Provide an explicit app-level bootstrap state so that:

1. The UI can show a branded loader while the initialization request resolves.
2. Route decisions wait until initialization either succeeds or fails, eliminating flicker.
3. Failure and timeout cases can surface meaningful messaging or recovery actions.

## Proposed Architecture

### New App Store (Zustand)

Create a single, app-level store in `src/store/appStore.ts` that reflects the auth bootstrap journey via a descriptive phase property:

```ts
type AppInitPhase = "idle" | "authCheck" | "ready" | "public" | "error";

interface AppState {
  initPhase: AppInitPhase; // conveys where the bootstrap flow currently sits
  phaseMessage?: string; // optional detail for loaders or errors
  setInitPhase: (phase: AppInitPhase, phaseMessage?: string) => void;
  resetInitPhase: () => void; // invoked on logout or hard refresh flows
}

// Store should be initialized with:
const useAppStore = create<AppState>((set) => ({
  initPhase: "idle",
  phaseMessage: undefined,
  setInitPhase: (phase, phaseMessage) =>
    set({ initPhase: phase, phaseMessage }),
  resetInitPhase: () => set({ initPhase: "idle", phaseMessage: undefined }),
}));
```

Implementation notes:

- Keep this store non-persisted so every reload starts from `"idle"`.
- Co-locate helper selectors such as `isBlockingPhase = initPhase === "idle" || initPhase === "authCheck"` for reuse in UI layers.
- The store defaults to `"idle"` which represents the pre-initialization state before `useInitUser` is invoked.

### Updated `useInitUser`

Wrap the existing network call with bootstrap state updates:

1. Before checking the token, set `initPhase` to `"authCheck"` and clear any previous `phaseMessage`.
2. If `hasValidToken()` returns false, immediately set `initPhase` to `"public"` so unauthenticated routes render without delay.
3. When fetching succeeds, keep `initPhase` at `"authCheck"` while the profile saves, then flip to `"ready"` once `setUser` completes so the rest of the UI knows the session is hydrated.
4. On failure, set `initPhase` to `"error"` with an explanatory `phaseMessage`, allowing the UI to render retry affordances.
5. Expose a helper hook like `useAppInitPhase()` that returns `{ initPhase, phaseMessage, initUser }` for any component that needs the lifecycle signal.

### Loader Component

Create `src/components/ui/AppInitScreen.tsx`:

- Displays the brand logo / wordmark plus a subtle skeleton or shimmer animation.
- Accepts the following props:
  ```ts
  interface AppInitScreenProps {
    phase: AppInitPhase;
    message?: string;
    onRetry?: () => void;
  }
  ```
- Renders branded loader for `"idle"` and `"authCheck"` phases
- Renders error state wiidle"`or`"authCheck"`, return `<AppInitScreen phase={initPhase} message="Preparing your dashboard" />`.
  - If `initPhase` is `"error"`, render `<AppInitScreen phase="error" message={phaseMessage} onRetry={initUser} />` to allow user retry without page reload. The error phase blocks rendering until retry succeeds or user manually refreshes

### Routing Layer Changes

In `MainRoutes`:

- Read `useAppStore((s) => ({ initPhase: s.initPhase, phaseMessage: s.phaseMessage }))`.
- Before rendering `<Routes>`, gate on the lifecycle phase:
  - If `initPhase` is `"authCheck"`, return `<AppInitScreen phase={initPhase} message="Preparing your dashboard" />`.
  - If `initPhase` is `"error"`, render the same component with retry UI connected to `initUser()`.
- Once `initPhase` is `"public"` or `"ready"`, fall back to the current routing logic while still keeping the `Suspense` fallback for lazy chunks.

### Protected Routes & Logout Flow

- Update `ProtectedRoute` so that it ignores auth decisions until `initPhase` is `"ready"` (with a user) or `"public"`, preventing accidental redirects while the lifecycle is mid-check.
- Ensure the logout path (`useLogout` or any manual call to `useAuthStore().logout`) also calls `resetInitPhase()` so re-entry replays the lifecycle consistently.

## Implementation Steps for the Next LLM

1. **Store:** Add `src/store/appStore.ts` per the interface above and export a `useAppStore` hook that exposes the `initPhase` helpers.
2. **Hook:** Refactor `useInitUser` to import the new store, wrapping the `getMe` call with the phase lifecycle and exposing `useAppInitPhase` for consumers.
3. **Loader UI:** Implement `AppInitScreen` (and, if desired, a slimmer `AppInitError` variant) under `src/components/ui/`. Use Tailwind utility classes already available in the project and keep it responsive for both desktop and mobile.
4. **Routing:** Modify `MainRoutes` to conditionally render based on `initPhase` while preserving the existing `Suspense` fallback for lazy-loaded chunks.
5. **Guards:** Update `ProtectedRoute` and any other entry points that gate on auth state to consider the phase enum before redirecting.
6. **Reset Paths:** Review `useLogout.tsx` (if present) and other flows that clear auth data to call `resetInitPhase()`.
7. **Telemetry (Optional):** If analytics/logging exists, emit events for `initPhase` transitions to monitor initialization health.

## Acceptance Criteria

- With a valid token, the loader is visible until the `getMe` request resolves, after which the user lands on `/dashboard` with no intermediate redirect flashes.
- Without a valid token, the loader either does not appear or only flashes momentarily before the app sends the visitor to `/login`.
- Network failures show the error state and allow retrying without reloading the page.
- Logging out and revisiting the app re-triggers the bootstrap sequence.
- No regressions to existing toast notifications or React Query cache usage.

## Testing Checklist

- Desktop and mobile viewport smoke tests (Chrome + Safari).
- Throttle network in DevTools to "Slow 3G" to verify the loader persists through longer bootstraps.
- Simulate token expiration to confirm the bootstrap gracefully clears the auth store and routes to `/login`.
- Unit-test the new store logic (at least reducer-level) if testing frameworks are configured; otherwise, add lightweight Jest tests for helper functions.
- If E2E coverage exists, add a case for "visit dashboard with cached token" ensuring zero `/login` flashes.
