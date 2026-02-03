# Stocks Frontend Module Instructions

> **For LLM:** This document defines how to build the **Stocks CRUD feature** in the Vite + React admin dashboard. Follow the existing patterns from the `auth` feature: keep routing files in `/pages`, put real screens and UI in `/features`, and use React Query, Tailwind CSS, and **daisyUI** for data and styling.

---

## High‑Level Goal

Build a **Stocks** section inside the authenticated dashboard that lets a seller manage their inventory:

- List all stocks belonging to the current authenticated user.
- Create a new stock item.
- Edit an existing stock item.
- Delete a stock item (with confirmation).
- Keep the UI simple, clean, and consistent with the existing auth screens (Cards, Inputs, Buttons, daisyUI classes).
- Integrate with the NestJS Stock API described in the backend `stock-module-llm-instructions.md` (no direct Supabase calls from the frontend).

All routes must be **behind the dashboard** and use the existing `ProtectedRoute` + `DashboardLayout` structure.

---

## Folder & Route Structure (Frontend)

Follow this structure when implementing the Stocks module:

```txt
src/
  api/
    authApi.ts
    dashboardApi.ts
    profileApi.ts
    stocksApi.ts          # NEW: stock CRUD API functions

  react-query/
    queries/
      auth.ts
      dashboard.ts
      stocks.ts          # NEW: useQuery hooks for stocks
    mutations/
      auth.ts
      stocks.ts          # NEW: useMutation hooks for stocks CRUD

  features/
    auth/
      LoginPage.tsx
      RegisterPage.tsx
    stocks/              # NEW: main stocks feature folder
      StocksListPage.tsx
      StockCreatePage.tsx
      StockEditPage.tsx
      components/
        StockTable.tsx
        StockFilters.tsx
        StockForm.tsx
      types.ts           # local types (Stock, filters)
      utils.ts           # mapping helpers, form defaults

  components/
    ui/
      button.tsx         # shared visual primitives
      input.tsx
      card.tsx
      ...
    forms/
      Form.tsx           # generic Formik wrapper (optional)
      fields/
        TextField.tsx    # Formik-aware input wrappers
        SelectField.tsx
        TextAreaField.tsx
        CheckboxField.tsx
        SwitchField.tsx

  pages/
    auth/
      login.tsx          # thin wrapper → features/auth/LoginPage
      register.tsx       # thin wrapper → features/auth/RegisterPage
    dashboard/
      index.tsx          # dashboard routes
      orders/
      settings/
      stocks/            # NEW: dashboard stocks routes
        AllStocks.tsx    # thin wrapper → features/stocks/StocksListPage
        CreateStock.tsx  # thin wrapper → features/stocks/StockCreatePage
        EditStock.tsx    # thin wrapper → features/stocks/StockEditPage
```

### Routing Pattern

- `/pages` files are **thin wrappers only**. They import and export the real screens from `/features`.
- Mirror the `auth` pattern; for example:

```tsx
// src/pages/dashboard/stocks/AllStocks.tsx
import StocksListPage from "@/features/stocks/StocksListPage";

export default StocksListPage;
```

```tsx
// src/pages/dashboard/stocks/CreateStock.tsx
import StockCreatePage from "@/features/stocks/StockCreatePage";

export default StockCreatePage;
```

```tsx
// src/pages/dashboard/stocks/EditStock.tsx
import StockEditPage from "@/features/stocks/StockEditPage";

export default StockEditPage;
```

- Register these routes in `src/pages/dashboard/index.tsx` (inside `DashboardRoutes`):
  - `"stocks"` → `AllStocks` (list view)
  - `"stocks/new"` → `CreateStock` (create form)
  - `"stocks/:stockId/edit"` → `EditStock` (edit form)

Use `lazy(() => import("./stocks/AllStocks"))` style imports, consistent with existing dashboard routes.

---

## API Layer: stocksApi.ts

Create `src/api/stocksApi.ts` to talk to the NestJS backend Stock module via the shared `fetcher` instance.

Map closely to the backend endpoints defined in the backend stock module instructions (`/stocks` base path):

- `getStocks(params)` → `GET /stocks` (list with filters + pagination)
- `getStockById(id)` → `GET /stocks/:id`
- `createStock(payload)` → `POST /stocks`
- `updateStock(id, payload)` → `PATCH /stocks/:id`
- `deleteStock(id)` → `DELETE /stocks/:id`

**Shapes:**

- Request payloads should follow the backend DTOs (`CreateStockDto`, `UpdateStockDto`), but use camelCase on the frontend.
- Backend responds with camelCase or a mapped structure; if needed, use mapping helpers in `features/stocks/utils.ts` to convert.

Keep this file focused on **HTTP only**; do not put React logic here.

---

## React Query: Queries & Mutations

Use the shared `react-query` folder pattern.

### Queries (src/react-query/queries/stocks.ts)

Define hooks that wrap `stocksApi`:

- `useStocksListQuery(filters)`
  - Key: `["stocks", filters]`
  - Calls `getStocks(filters)`.
  - Supports `page`, `limit`, `search`, `marketplace`, `stockStatus`, `sortBy`, `sortOrder`.

- `useStockDetailQuery(stockId)`
  - Key: `["stock", stockId]`
  - Calls `getStockById(stockId)`.
  - Skip / do not run when `stockId` is falsy.

### Mutations (src/react-query/mutations/stocks.ts)

- `useCreateStockMutation()` → wraps `createStock`.
- `useUpdateStockMutation()` → wraps `updateStock`.
- `useDeleteStockMutation()` → wraps `deleteStock`.

Handle cache invalidation after mutations:

- After `createStock` and `deleteStock`, invalidate `["stocks"]` list queries.
- After `updateStock`, invalidate both `["stocks"]` and `["stock", stockId]`.

Use the same patterns as existing auth mutations (e.g. `useLoginMutation`), including error handling and loading states.

---

## Feature Screens & Components (features/stocks)

### 1. StocksListPage.tsx

Responsibilities:

- Fetch and display a paginated list of stocks using `useStocksListQuery`.
- Provide filters for **search**, **marketplace**, **status**.
- Provide an “Add stock” button that navigates to `/dashboard/stocks/new`.
- Show a responsive table using daisyUI + Tailwind classes.

Simple but good UI structure:

- Outer wrapper: `min-h-screen bg-base-200` (if full page) or inherit dashboard background.
- Card layout, similar to auth screens, using `Card` / `CardHeader` / `CardContent` components.
- Use a top bar with:
  - Title: `Stocks`.
  - Right-aligned `Add stock` button using the shared `Button` component.
- Below the header, show `StockFilters` (search input + selects) and then `StockTable`.

Columns for the table:

- Image (thumbnail of `mainImageUrl` if available)
- Title
- SKU
- Marketplace
- Stock status (badge colors via daisyUI, e.g. `badge-success`, `badge-warning`, etc.)
- Quantity
- Price (format with `£` / currency)
- Actions (Edit, Delete buttons)

Handle loading and error states with simple daisyUI patterns:

- Loading: `div` with `loading loading-spinner` class.
- Error: `div` with `alert alert-error`.

### 2. StockCreatePage.tsx

Responsibilities:

- Render a form to create a new stock record.
- Use `StockForm` component to render form fields.
- Use `useCreateStockMutation` for submission.
- On success, navigate back to `/dashboard/stocks` and optionally show a toast.

Form fields (match backend DTOs):

- `title` (required text)
- `description` (textarea)
- `sku` (text)
- `marketplace` (select: AMAZON, EBAY, TIKTOK, SHOPIFY, OTHER)
- `stockStatus` (select: DRAFT, IN_STOCK, OUT_OF_STOCK, DISCONTINUED, ARCHIVED)
- `quantity` (number, min 0)
- `price` (number, 2 decimal places)
- `currency` (text; default `GBP`, can be read-only)
- `sizeLabel` (optional text)
- `colorLabel` (optional text)
- `tags` (optional, can be comma-separated string that is split into an array)
- `mainImage` (optional image upload with preview)

### 3. StockEditPage.tsx

Responsibilities:

- Read `stockId` from the route params.
- Use `useStockDetailQuery(stockId)` to fetch existing data.
- Pre-fill `StockForm` with the current values.
- On submit, call `useUpdateStockMutation` and go back to `/dashboard/stocks` (or stay and show success).

Handle:

- Loading state while fetching the stock.
- Not found / error state via a simple message and back button.

### 4. Shared Components

- `StockTable.tsx` – Stateless table that receives `stocks`, `isLoading`, `isError` and render logic is driven by props. Uses daisyUI `table` classes.
- `StockFilters.tsx` – Small component with search input and two dropdowns (marketplace, status). Lifts state up via callbacks so `StocksListPage` can pass filters into the query.
- `StockForm.tsx` – Handles inputs, validation errors, and submit callback; supports both create and edit modes via props:
  - `initialValues`
  - `onSubmit(values)`
  - `isSubmitting`

Use the existing shared `Button`, `Input`, and `Card` components for consistency.

---

## Image Upload Flow (Frontend)

Follow the backend design (single main image per stock). Assume the backend exposes a separate file upload endpoint (e.g. `POST /files/stock-image`).

Recommended flow:

1. In `StockForm`, handle selection of an image file via a standard `<input type="file" />`.
2. When the user selects a file and confirms the form submission:
   - First upload the file using a dedicated React Query mutation (e.g. `useUploadStockImageMutation` calling `POST /files/stock-image`).
   - Receive `{ path, publicUrl }` from the backend.
3. Include `mainImageUrl` (and optionally `mainImagePath`) in the payload to `createStock` / `updateStock`.
4. Show a small preview thumbnail using `publicUrl` inside the form.

Keep the upload logic separate from the core `createStock` / `updateStock` mutations for clarity and reuse.

---

## Simple, Consistent UI with daisyUI

Use daisyUI classes together with existing UI components to keep the module simple but high quality.

- Wrap screens in a `Card` similar to `LoginPage` and `RegisterPage`.
- Use `bg-base-200` on the page background when appropriate.
- Use `btn`, `btn-primary`, `btn-ghost`, `btn-outline` for buttons alongside the shared `Button` component.
- Use `badge`, `badge-success`, `badge-warning`, etc. for stock statuses.
- Use `table`, `table-zebra`, and responsive container classes for the list view.

The goal is a clean, readable admin UI that matches the rest of the dashboard rather than a custom design.

---

## State, Navigation & Auth

- All stocks routes live under `/dashboard/*` and are wrapped by `ProtectedRoute`, so the user must be authenticated.
- Use `react-router-dom` navigation (`useNavigate`) to move between list, create, and edit screens.
- Do not store large stock lists in Zustand; prefer React Query for server state.
- If you need small UI-only bits of state (filters, modals), manage them locally inside the stocks feature.

---

## Summary for LLM

- Create a `stocksApi.ts` file, React Query queries/mutations for stocks, and a full `features/stocks` feature following the pattern of `features/auth`.
- Implement three main screens (`StocksListPage`, `StockCreatePage`, `StockEditPage`) and wire them to `/pages/dashboard/stocks` wrappers.
- Use daisyUI + existing shared components (`Button`, `Card`, `Input`) for a simple, modern CRUD UI.
- Integrate strictly with the NestJS Stock API; do not call Supabase directly from the frontend.
