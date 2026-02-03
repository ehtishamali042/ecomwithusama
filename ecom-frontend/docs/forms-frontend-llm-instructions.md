# Forms & Formik Best Practices (Frontend)

> **For LLM & Devs:** This document defines how to implement **forms and validation** across the dashboard using **Formik + Yup** (or a similar schema library). The goal is to have a **consistent, scalable pattern** that works for all features (auth, stocks, profile, settings, etc.), not just the Stocks module.

---

## Goals

- Consistent form UX across the entire dashboard (inputs, labels, errors, buttons).
- Centralize **Form wrapper logic** (submit, disabled/loading, error display) so each feature only focuses on **fields + validation schema**.
- Use **Formik** for form state and submission.
- Use **Yup** for validation schemas (field-level + cross-field rules).
- Make it easy to **reuse form building blocks** (e.g. TextInput, Select, Switch, Checkbox) wired to Formik.

---

## Folder & Naming Conventions

Use these conventions so every feature builds forms the same way.

```txt
src/
  components/
    ui/
      button.tsx        # Shared visual primitives (already exist)
      input.tsx
      card.tsx
      ...               # Other non-Formik UI primitives
    forms/
      Form.tsx          # Generic Form + Formik wrapper (optional)
      fields/
        TextField.tsx   # Generic wrapper for label + Input + error
        TextAreaField.tsx
        SelectField.tsx
        CheckboxField.tsx
        SwitchField.tsx
        ...             # All Formik-aware field components live here

  features/
    auth/
      LoginPage.tsx
      components/
        LoginForm.tsx   # Uses Formik + shared field components

    stocks/
      StocksListPage.tsx
      StockCreatePage.tsx
      StockEditPage.tsx
      components/
        StockForm.tsx   # Uses Formik + shared field components
      validation.ts     # Yup schemas & helpers for stock forms
      types.ts

    settings/
      SettingsPage.tsx
      components/
        SettingsForm.tsx
      validation.ts

    profile/
      UpdateProfile.tsx
      components/
        ProfileForm.tsx
      validation.ts
```

**Rules:**

- Each feature that has forms should have **one `validation.ts`** file colocated in the feature folder.
- Feature-specific main forms live in `features/<feature>/components/*Form.tsx`.
- Shared **form building blocks** (Formik-aware generic text input, select, checkbox, switch, textarea, etc.) live under `components/forms/fields`.
- The `components/ui` folder only contains **dumb visual primitives** (Button, Input, Card, etc.) with no Formik awareness.
- If you need a new kind of field (e.g. Select, Checkbox, Switch) and its base primitive does **not** exist yet in `components/ui`, first create the base UI component there (e.g. `Select` in `components/ui/select.tsx`), then create the corresponding Formik wrapper in `components/forms/fields` (e.g. `SelectField.tsx`) that composes that primitive.

---

## Technology Stack for Forms

- **Formik** for form state, submission, and touched/dirty tracking.
- **Yup** for synchronous validation schema.
- **Tailwind CSS + daisyUI** for styling.
- Existing shared UI components (`Button`, `Input`, `Card`) for consistent look.

> If a feature needs async validation (e.g., check if SKU is unique), use a **React Query** call in the submit handler or a debounced effect – do **not** mix HTTP calls inside Yup schemas.

---

## Core Patterns

### 1. Centralized Form Wrapper (Optional but Recommended)

Create a reusable **Form + Formik wrapper** so every form screen has the same structure.

**Responsibilities:**

- Initialize Formik with `initialValues`, `validationSchema`, and `onSubmit`.
- Provide a `Form` component that wraps `formik.handleSubmit`.
- Handle `isSubmitting` state for disabling buttons and showing loading states.

**Usage pattern (conceptual):**

```tsx
// Example: StockForm.tsx (feature-level)

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/forms/fields";
import { stockInitialValues, stockValidationSchema } from "../validation";

export function StockForm({
  initialValues = stockInitialValues,
  onSubmit,
  submitLabel,
}: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stockValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <TextField name="title" label="Title" required />
          <TextField name="sku" label="SKU" />
          <SelectField
            name="marketplace"
            label="Marketplace"
            options={MARKETPLACE_OPTIONS}
          />
          {/* more fields... */}

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
```

### 2. Yup Validation Schemas per Feature

- For each feature, define schemas in `validation.ts`.
- Export **initial values** and **schemas** together to keep them in sync.

**Example shape for Stocks (conceptual):**

```ts
// features/stocks/validation.ts

import * as Yup from "yup";

export const stockInitialValues = {
  title: "",
  description: "",
  sku: "",
  marketplace: "AMAZON",
  stockStatus: "IN_STOCK",
  quantity: 0,
  price: 0,
  currency: "GBP",
  sizeLabel: "",
  colorLabel: "",
  tags: "",
};

export const stockValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  sku: Yup.string().max(64, "SKU is too long"),
  marketplace: Yup.string().required("Marketplace is required"),
  stockStatus: Yup.string().required("Status is required"),
  quantity: Yup.number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  price: Yup.number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  currency: Yup.string().required("Currency is required"),
});
```

**Rules:**

- Use **human-readable error messages**.
- Use **`.required()`** for mandatory fields and **`.nullable()`** where empty is allowed.
- For cross-field validation (e.g., `startDate <= endDate`), use `Yup.mixed().test(...)` or a top-level `.test` on the schema, not inline hacks.

### 3. Shared Form Field Components

Create generic Formik-aware components in `components/forms/fields`, for example:

- `TextField` – text, email, number, password.
- `TextAreaField` – multi-line input.
- `SelectField` – dropdown with label + error.
- `CheckboxField` – boolean toggles.
- `SwitchField` – boolean toggle styled as a switch.

These should:

- Use `useField(name)` from Formik.
- Render label, `Input` (or other UI control), and error state.
- Accept props for `label`, `placeholder`, `type`, `required`, `helperText`, etc.

**Conceptual example:**

```tsx
// components/forms/fields/TextField.tsx

import { useField } from "formik";
import { Input } from "@/components/ui/input";

export function TextField({ label, helperText, ...props }) {
  const [field, meta] = useField(props.name);
  const isError = meta.touched && meta.error;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <Input
        {...field}
        {...props}
        className={
          "input input-bordered w-full" + (isError ? " input-error" : "")
        }
      />
      {helperText && !isError && (
        <span className="label-text-alt text-base-content/60">
          {helperText}
        </span>
      )}
      {isError && (
        <span className="label-text-alt text-error">{meta.error}</span>
      )}
    </div>
  );
}
```

**Rules:**

- All new forms should use these shared `components/forms/fields/*` components instead of raw `<input>` / `<select>` elements where possible.
- When introducing a new control type, always:
  - Add or reuse a **base visual component** in `components/ui` (e.g. `Select`, `Textarea`, `Checkbox`).
  - Wrap it in a **Formik-aware field component** in `components/forms/fields` (e.g. `SelectField`, `TextAreaField`, `CheckboxField`).
- Styling: use Tailwind + daisyUI classes (`form-control`, `input`, `textarea`, `select`, `label`, etc.).

### 4. Loading & Disabled States

- Use Formik’s `isSubmitting` or feature-level `isLoading` flags (e.g., from React Query mutation) to **disable** the submit button and key inputs during submission.
- Show a loading indicator on submit buttons (`btn loading` / spinner icon).

**Pattern:**

- `submit` button: `disabled={isSubmitting || mutation.isLoading}`.
- Avoid double-submits by always binding `onSubmit` to Formik.

### 5. Error Handling (Server + Client)

- **Client-side errors:** come from Yup (`meta.error`). Show them inline under each field.
- **Server-side errors:** (e.g. `400` with field errors or `409` conflict) should:
  - Use `setFieldError` for specific fields when the backend returns a clear field.
  - Otherwise show a top-level error alert using daisyUI (`alert alert-error`) above the form.

**Pattern:**

- In React Query `onError`, parse the error response.
- If it includes `{ fieldErrors: { email: "Already used" } }`, call `setFieldError("email", "Already used")`.
- Otherwise set a generic `formError` state that is rendered in an alert.

---

## Feature-Level Usage Patterns

### Auth Forms (Login, Register)

- Follow the existing `LoginPage` / `RegisterPage` UX.
- Use Formik + Yup with simple fields: `email`, `password`, `name`, etc.
- On submit, call the auth React Query mutation and map backend errors to fields or a top-level error alert.

### Stocks Forms (Create, Edit)

- Use a **single `StockForm` component** used by both create and edit pages.
- `StockCreatePage` passes **default initial values** from `stockInitialValues`.
- `StockEditPage` passes initial values from the loaded stock (mapped to the same shape as `stockInitialValues`).
- Validation: enforce required fields, numeric ranges, and valid enums for `marketplace`, `stockStatus`, etc.

### Profile & Settings Forms

- Similar structure: one `ProfileForm` / `SettingsForm` per feature.
- Colocate validation in `validation.ts`.
- Use shared Formik field components for consistency.

---

## UX Guidelines for All Forms

- **Labels always**: every field must have a descriptive label.
- **Helper text**: optional but recommended for non-obvious fields.
- **Error color + icon**: use `text-error` / `border-error` classes and consistent placement under the field.
- **Group related fields**: e.g., `price` + `currency` on the same row.
- **Tab order**: ensure tabbing through fields follows a logical order.
- **Submit button position**: right-aligned or full-width at the bottom of the form; consistent across the app.

---

## Do / Dont Summary

**Do:**

- Do use **Formik + Yup** for all non-trivial forms.
- Do colocate **`validation.ts`** with each feature.
- Do use shared, Formik-aware components from `components/forms/fields` and shared visual primitives from `components/ui`.
- Do keep HTTP calls inside React Query hooks or page-level handlers, not inside Yup.
- Do keep form components **presentational**, with all side effects in page/container components.

**Dont:**

- Dont build ad-hoc forms with `useState` per field (except for extremely simple, local-only UI forms).
- Dont mix form layout, API calls, and routing logic all in one giant component.
- Dont duplicate validation logic in multiple components; instead, reuse schemas from `validation.ts`.

---

## Summary for LLM

- Use **Formik + Yup** as the standard for all dashboard forms.
- Place feature-specific schemas and initial values in `features/<feature>/validation.ts`.
- Implement reusable, Formik-aware input components in `components/forms/fields` and use them in all forms.
- Keep forms consistent with Tailwind + daisyUI styling and existing UI primitives (`Button`, `Input`, `Card`).
- For Stocks specifically, implement a reusable `StockForm` that follows these patterns and is used by both create and edit pages, but keep this guide generic so it can serve **all** future features.

### Example LLM Prompt: Update StockForm to Use This Guide

When asking an LLM to implement or refactor the Stocks form, use a prompt like:

> You are working in a Vite + React + TypeScript dashboard that uses Formik + Yup for forms. Follow the shared forms guidelines in `docs/forms-frontend-llm-instructions.md` and the Stocks feature spec in `docs/stock-frontend-llm-instructions.md`. In `src/features/stocks/components/StockForm.tsx`, refactor the form to:
>
> - Use a single reusable `StockForm` component for both create and edit.
> - Use `stockInitialValues` and `stockValidationSchema` from `src/features/stocks/validation.ts`.
> - Use shared Formik-aware fields from `src/components/forms/fields` (e.g. `TextField`, `SelectField`, `TextAreaField`).
> - Keep styling consistent with Tailwind + daisyUI (`Card`, `Button`, `Input` from `src/components/ui`).
>   Do not change the routing setup or React Query hooks; focus only on the form component and, if needed, the `validation.ts` file.
