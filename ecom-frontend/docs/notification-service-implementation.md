# Toast Notification Service Implementation Guide

## 📋 Overview

This document provides comprehensive instructions for implementing a centralized toast notification service using **react-hot-toast** (already installed in the project). This service will provide consistent, reusable notification methods across the application.

---

## 🎯 Why react-hot-toast?

**react-hot-toast** is already installed in your project and is the BEST choice because:

- ✅ **Extremely Lightweight** (~5KB gzipped)
- ✅ **Zero dependencies** beyond React
- ✅ **Highly customizable** with excellent TypeScript support
- ✅ **Beautiful out-of-the-box** with smooth animations
- ✅ **Accessible** (keyboard navigation, screen reader support)
- ✅ **Promise-based toasts** for async operations
- ✅ **Custom positioning** and styling
- ✅ **Headless mode** available for complete custom UI

**Alternative Options Evaluated:**

- ❌ **DaisyUI Toast**: Requires manual DOM manipulation, not React-friendly
- ❌ **react-toastify**: Heavier (~25KB), more complex setup
- ❌ **sonner**: Good but adds another dependency

---

## 🏗️ Architecture & File Structure

### Files to Create:

```
src/
├── services/
│   └── notificationService.ts    # Core notification service
├── constants/
│   └── notificationMessages.ts   # Centralized messages (optional but recommended)
└── App.tsx                        # Add Toaster component here
```

---

## 📝 Implementation Steps

### Step 1: Create the Notification Service

**File:** `src/services/notificationService.ts`

```typescript
import toast, { type ToastOptions } from "react-hot-toast";

/**
 * Centralized notification service using react-hot-toast
 * Provides consistent toast notifications across the application
 */

// Default configuration for all toasts
const DEFAULT_CONFIG: ToastOptions = {
  duration: 4000,
  position: "top-right",

  // Custom styling to match your theme
  style: {
    background: "#363636",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  // Animation settings
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
};

// Custom configurations for each notification type
const SUCCESS_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 3000,
  icon: "✅",
  style: {
    ...DEFAULT_CONFIG.style,
    background: "#10b981", // green-500
    color: "#fff",
  },
};

const ERROR_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 5000,
  icon: "❌",
  style: {
    ...DEFAULT_CONFIG.style,
    background: "#ef4444", // red-500
    color: "#fff",
  },
};

const WARNING_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 4000,
  icon: "⚠️",
  style: {
    ...DEFAULT_CONFIG.style,
    background: "#f59e0b", // amber-500
    color: "#fff",
  },
};

const INFO_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 3500,
  icon: "ℹ️",
  style: {
    ...DEFAULT_CONFIG.style,
    background: "#3b82f6", // blue-500
    color: "#fff",
  },
};

// Loading toast configuration
const LOADING_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: Infinity, // Loading toasts don't auto-dismiss
  icon: "⏳",
};

/**
 * Notification Service
 *
 * Provides methods for showing different types of toast notifications
 * All methods return a toast ID that can be used to dismiss/update the toast
 */
export const notificationService = {
  /**
   * Show a success notification
   * @param message - The message to display
   * @param options - Optional toast configuration overrides
   * @returns Toast ID
   *
   * @example
   * notificationService.showSuccess('Stock created successfully!');
   */
  showSuccess(message: string, options?: ToastOptions): string {
    return toast.success(message, { ...SUCCESS_CONFIG, ...options });
  },

  /**
   * Show an error notification
   * @param message - The error message to display
   * @param options - Optional toast configuration overrides
   * @returns Toast ID
   *
   * @example
   * notificationService.showError('Failed to delete stock');
   */
  showError(message: string, options?: ToastOptions): string {
    return toast.error(message, { ...ERROR_CONFIG, ...options });
  },

  /**
   * Show a warning notification
   * @param message - The warning message to display
   * @param options - Optional toast configuration overrides
   * @returns Toast ID
   *
   * @example
   * notificationService.showWarning('Stock quantity is low');
   */
  showWarning(message: string, options?: ToastOptions): string {
    return toast(message, { ...WARNING_CONFIG, ...options });
  },

  /**
   * Show an info notification
   * @param message - The info message to display
   * @param options - Optional toast configuration overrides
   * @returns Toast ID
   *
   * @example
   * notificationService.showInfo('Stock status updated');
   */
  showInfo(message: string, options?: ToastOptions): string {
    return toast(message, { ...INFO_CONFIG, ...options });
  },

  /**
   * Show a loading notification
   * @param message - The loading message to display
   * @param options - Optional toast configuration overrides
   * @returns Toast ID that can be used to update/dismiss the loading toast
   *
   * @example
   * const loadingId = notificationService.showLoading('Creating stock...');
   * // Later...
   * notificationService.dismissToast(loadingId);
   */
  showLoading(message: string, options?: ToastOptions): string {
    return toast.loading(message, { ...LOADING_CONFIG, ...options });
  },

  /**
   * Show a promise-based toast that automatically updates based on promise state
   * @param promise - The promise to track
   * @param messages - Messages for pending, success, and error states
   * @param options - Optional toast configuration overrides
   *
   * @example
   * notificationService.showPromise(
   *   createStockApi(data),
   *   {
   *     loading: 'Creating stock...',
   *     success: 'Stock created successfully!',
   *     error: 'Failed to create stock',
   *   }
   * );
   */
  showPromise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions,
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      { ...DEFAULT_CONFIG, ...options },
    );
  },

  /**
   * Dismiss a specific toast by ID
   * @param toastId - The ID of the toast to dismiss
   *
   * @example
   * const id = notificationService.showLoading('Processing...');
   * notificationService.dismissToast(id);
   */
  dismissToast(toastId: string): void {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all visible toasts
   *
   * @example
   * notificationService.dismissAll();
   */
  dismissAll(): void {
    toast.dismiss();
  },

  /**
   * Show a custom toast with full control
   * @param content - React component or string to display
   * @param options - Toast configuration
   * @returns Toast ID
   *
   * @example
   * notificationService.showCustom(
   *   <div>Custom <strong>content</strong></div>,
   *   { duration: 5000 }
   * );
   */
  showCustom(content: React.ReactNode, options?: ToastOptions): string {
    return toast.custom(content, { ...DEFAULT_CONFIG, ...options });
  },
};

/**
 * Type-safe notification service
 * Export this for TypeScript consumers
 */
export type NotificationService = typeof notificationService;
```

---

### Step 2: Create Centralized Message Constants (Optional but Recommended)

**File:** `src/constants/notificationMessages.ts`

```typescript
/**
 * Centralized notification messages
 * Makes it easy to maintain consistent messaging and update in one place
 */

export const NOTIFICATION_MESSAGES = {
  // Stock operations
  STOCK: {
    CREATE_SUCCESS: "Stock created successfully!",
    CREATE_ERROR: "Failed to create stock. Please try again.",
    CREATE_LOADING: "Creating stock...",

    UPDATE_SUCCESS: "Stock updated successfully!",
    UPDATE_ERROR: "Failed to update stock. Please try again.",
    UPDATE_LOADING: "Updating stock...",

    DELETE_SUCCESS: "Stock deleted successfully!",
    DELETE_ERROR: "Failed to delete stock. Please try again.",
    DELETE_LOADING: "Deleting stock...",

    DELETE_CONFIRMATION: "Are you sure you want to delete this stock?",
  },

  // Authentication
  AUTH: {
    LOGOUT_SUCCESS: "Logged out successfully",
    SESSION_EXPIRED: "Your session has expired. Please login again.",
    FORCE_LOGOUT: "You have been logged out due to inactivity",
    UNAUTHORIZED: "You are not authorized to perform this action",
  },

  // File operations
  FILE: {
    UPLOAD_SUCCESS: "File uploaded successfully!",
    UPLOAD_ERROR: "Failed to upload file. Please try again.",
    UPLOAD_LOADING: "Uploading file...",
    INVALID_FILE_TYPE: "Invalid file type. Please upload a valid file.",
    FILE_TOO_LARGE: "File size exceeds maximum allowed size",
  },

  // Profile
  PROFILE: {
    UPDATE_SUCCESS: "Profile updated successfully!",
    UPDATE_ERROR: "Failed to update profile. Please try again.",
  },

  // Generic messages
  GENERIC: {
    NETWORK_ERROR: "Network error. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    OPERATION_SUCCESS: "Operation completed successfully",
  },
} as const;

// Type for autocomplete
export type NotificationMessages = typeof NOTIFICATION_MESSAGES;
```

---

### Step 3: Add Toaster Component to App

**File:** `src/App.tsx`

Modify your existing App component to include the Toaster:

```tsx
import { Toaster } from "react-hot-toast";
// ... your other imports

function App() {
  return (
    <>
      {/* Add this Toaster component at the root level */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for ALL toasts
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          },

          // Type-specific options
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Your existing app content */}
      <YourAppContent />
    </>
  );
}

export default App;
```

---

## 🔧 Implementation in Existing Code

### 1. Update Stock Mutations

**File:** `src/react-query/mutations/stocks.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStock, updateStock, deleteStock } from "../../api/stocksApi";
import type { StockPayload } from "../../api/stocksApi";
import { uploadStockImage } from "../../api/filesApi";
import type { UploadResponse } from "../../api/filesApi";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

export function useCreateStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.CREATE_SUCCESS,
      );
    },
    onError: (error: Error) => {
      notificationService.showError(NOTIFICATION_MESSAGES.STOCK.CREATE_ERROR);
      console.error("Create stock error:", error);
    },
  });
}

export function useUpdateStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<StockPayload>;
    }) => updateStock(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      if (variables && variables.id)
        qc.invalidateQueries({ queryKey: ["stock", variables.id] });
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.UPDATE_SUCCESS,
      );
    },
    onError: (error: Error) => {
      notificationService.showError(NOTIFICATION_MESSAGES.STOCK.UPDATE_ERROR);
      console.error("Update stock error:", error);
    },
  });
}

export function useDeleteStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStock(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.DELETE_SUCCESS,
      );
    },
    onError: (error: Error) => {
      notificationService.showError(NOTIFICATION_MESSAGES.STOCK.DELETE_ERROR);
      console.error("Delete stock error:", error);
    },
  });
}

export function useUploadStockImageMutation() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadStockImage(file),
    onSuccess: () => {
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.FILE.UPLOAD_SUCCESS,
      );
    },
    onError: (error: Error) => {
      notificationService.showError(NOTIFICATION_MESSAGES.FILE.UPLOAD_ERROR);
      console.error("Upload error:", error);
    },
  });
}
```

---

### 2. Update Force Logout Function

**File:** `src/utils/forceLogout.ts`

```typescript
import { authStorage } from "@/service/authStorage";
import { useAuthStore } from "@/store/authStore";
import { QueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

export function forceLogout(
  reason?: "session_expired" | "unauthorized" | "inactivity",
) {
  // Show appropriate notification based on reason
  switch (reason) {
    case "session_expired":
      notificationService.showWarning(
        NOTIFICATION_MESSAGES.AUTH.SESSION_EXPIRED,
      );
      break;
    case "unauthorized":
      notificationService.showError(NOTIFICATION_MESSAGES.AUTH.UNAUTHORIZED);
      break;
    case "inactivity":
      notificationService.showInfo(NOTIFICATION_MESSAGES.AUTH.FORCE_LOGOUT);
      break;
    default:
      notificationService.showInfo(NOTIFICATION_MESSAGES.AUTH.LOGOUT_SUCCESS);
  }

  // Clear token
  authStorage.clearToken();

  // Clear Zustand auth store
  const { logout } = useAuthStore.getState();
  logout();

  // Clear all react-query cache
  const queryClient = new QueryClient();
  queryClient.clear();

  // Small delay to ensure toast is visible before redirect
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
```

---

### 3. Update StocksListPage (Optional - for delete confirmation)

**File:** `src/features/stocks/StocksListPage.tsx`

```typescript
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StockFilters from "./components/StockFilters";
import StockTable from "./components/StockTable";
import { useStocksListQuery } from "@/react-query/queries/stocks";
import { useDeleteStockMutation } from "@/react-query/mutations/stocks";
import { useNavigate } from "react-router-dom";
import type { StocksListParams } from "@/api/stocksApi";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

export default function StocksListPage() {
  const [filters, setFilters] = useState<StocksListParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useStocksListQuery(filters);
  const deleteMut = useDeleteStockMutation();
  const navigate = useNavigate();

  function handleDelete(id: string) {
    if (!confirm(NOTIFICATION_MESSAGES.STOCK.DELETE_CONFIRMATION)) return;

    // Show loading toast
    const loadingId = notificationService.showLoading(
      NOTIFICATION_MESSAGES.STOCK.DELETE_LOADING
    );

    deleteMut.mutate(id, {
      onSettled: () => {
        // Dismiss loading toast regardless of success/error
        // The mutation handlers will show success/error toasts
        notificationService.dismissToast(loadingId);
      },
    });
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-6 px-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Stocks
          </CardTitle>
          <Button onClick={() => navigate("/dashboard/stocks/new")}>
            Add Stock
          </Button>
        </CardHeader>
        <CardContent>
          <StockFilters
            search={filters.search}
            marketplace={filters.marketplace}
            stockStatus={filters.stockStatus}
            onChange={(next) => setFilters((f) => ({ ...f, ...next, page: 1 }))}
          />
          <StockTable
            stocks={data?.items || []}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎨 Advanced Usage Examples

### Example 1: Promise-based Toast (Automatic Loading/Success/Error)

```typescript
import { notificationService } from "@/services/notificationService";
import { createStock } from "@/api/stocksApi";

// The toast will automatically show loading, then success or error
async function handleCreateStock(data: StockPayload) {
  await notificationService.showPromise(createStock(data), {
    loading: "Creating stock...",
    success: "Stock created successfully!",
    error: "Failed to create stock",
  });
}
```

### Example 2: Custom Toast with JSX Content

```typescript
notificationService.showCustom(
  <div className="flex items-center gap-3">
    <img src="/icon.png" alt="" className="w-8 h-8" />
    <div>
      <strong>Stock Alert!</strong>
      <p className="text-sm">Low inventory detected</p>
    </div>
  </div>,
  { duration: 6000 }
);
```

### Example 3: Dismissible Loading Toast

```typescript
// Show loading
const loadingId = notificationService.showLoading("Processing large file...");

// Dismiss after operation
try {
  await longRunningOperation();
  notificationService.dismissToast(loadingId);
  notificationService.showSuccess("Operation completed!");
} catch (error) {
  notificationService.dismissToast(loadingId);
  notificationService.showError("Operation failed!");
}
```

### Example 4: API Error Handling with Axios Interceptor

```typescript
// In your API setup file
import axios from "axios";
import { notificationService } from "@/services/notificationService";
import { forceLogout } from "@/utils/forceLogout";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout("unauthorized");
    } else if (error.response?.status >= 500) {
      notificationService.showError("Server error. Please try again later.");
    } else if (!navigator.onLine) {
      notificationService.showError("No internet connection");
    }
    return Promise.reject(error);
  },
);
```

---

## 🎯 Best Practices

### 1. **Consistent Message Patterns**

```typescript
// ✅ GOOD: Clear, action-oriented messages
notificationService.showSuccess("Stock created successfully!");
notificationService.showError("Failed to create stock. Please try again.");

// ❌ BAD: Vague or technical messages
notificationService.showError("Error 500");
notificationService.showSuccess("OK");
```

### 2. **Appropriate Duration**

```typescript
// Quick confirmations
notificationService.showSuccess("Saved!", { duration: 2000 });

// Important errors (user needs to read)
notificationService.showError("Payment failed. Check card details.", {
  duration: 6000,
});

// Info messages
notificationService.showInfo("Processing...", { duration: 3000 });
```

### 3. **Don't Overuse**

```typescript
// ❌ BAD: Too many toasts
notificationService.showInfo("Validating...");
notificationService.showInfo("Sending request...");
notificationService.showInfo("Processing...");
notificationService.showSuccess("Done!");

// ✅ GOOD: Single meaningful toast
const loadingId = notificationService.showLoading("Creating stock...");
// ... operation
notificationService.dismissToast(loadingId);
notificationService.showSuccess("Stock created!");
```

### 4. **Error Context**

```typescript
// ✅ GOOD: Provide context and action
notificationService.showError(
  "Failed to upload image. File size must be under 5MB.",
  { duration: 5000 },
);

// ❌ BAD: Generic error
notificationService.showError("Upload failed");
```

### 5. **Loading States**

```typescript
// ✅ GOOD: Show loading for operations > 1 second
const loadingId = notificationService.showLoading("Uploading...");
await uploadFile();
notificationService.dismissToast(loadingId);

// ❌ BAD: Loading for instant operations
const id = notificationService.showLoading("Validating...");
const isValid = value.length > 0; // Instant
notificationService.dismissToast(id);
```

---

## 🧪 Testing Considerations

### Unit Testing

```typescript
import { notificationService } from "@/services/notificationService";
import toast from "react-hot-toast";

// Mock react-hot-toast
jest.mock("react-hot-toast");

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show success toast with correct message", () => {
    notificationService.showSuccess("Test message");
    expect(toast.success).toHaveBeenCalledWith(
      "Test message",
      expect.objectContaining({ icon: "✅" }),
    );
  });

  it("should show error toast with correct configuration", () => {
    notificationService.showError("Error message");
    expect(toast.error).toHaveBeenCalledWith(
      "Error message",
      expect.objectContaining({
        duration: 5000,
        icon: "❌",
      }),
    );
  });
});
```

---

## 🎨 Customization Options

### Custom Themes

If you want to match DaisyUI themes or customize further:

```typescript
// Add to notificationService.ts

// Detect current theme
const getCurrentTheme = () => {
  return document.documentElement.getAttribute("data-theme") || "light";
};

// Theme-aware colors
const getThemeColors = () => {
  const theme = getCurrentTheme();
  const styles = getComputedStyle(document.documentElement);

  return {
    success: styles.getPropertyValue("--success") || "#10b981",
    error: styles.getPropertyValue("--error") || "#ef4444",
    warning: styles.getPropertyValue("--warning") || "#f59e0b",
    info: styles.getPropertyValue("--info") || "#3b82f6",
    background: styles.getPropertyValue("--b1") || "#363636",
    text: styles.getPropertyValue("--bc") || "#fff",
  };
};

// Update configs to use theme colors
const SUCCESS_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  style: {
    ...DEFAULT_CONFIG.style,
    background: getThemeColors().success,
  },
};
```

### Custom Icons

```typescript
// Use Heroicons, Lucide, or custom SVG components
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const SUCCESS_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  icon: <CheckCircleIcon className="w-5 h-5" />,
};
```

---

## 📊 Migration Checklist

- [ ] Create `src/services/notificationService.ts`
- [ ] Create `src/constants/notificationMessages.ts` (optional)
- [ ] Add `<Toaster />` component to `src/App.tsx`
- [ ] Update `src/react-query/mutations/stocks.ts` with notifications
- [ ] Update `src/utils/forceLogout.ts` with notifications
- [ ] Update `src/features/stocks/StocksListPage.tsx` (optional)
- [ ] Test all stock operations (create, update, delete)
- [ ] Test force logout scenarios
- [ ] Update other mutation files as needed
- [ ] Add to component library documentation
- [ ] Update team about new notification patterns

---

## 🔗 Resources

- **react-hot-toast Documentation**: https://react-hot-toast.com/
- **API Reference**: https://react-hot-toast.com/docs/toast
- **GitHub**: https://github.com/timolins/react-hot-toast

---

## 🤔 FAQ

**Q: Can I use this with React Router navigation?**
A: Yes! The toasts persist across navigation. Just ensure `<Toaster />` is in your root component.

**Q: How do I customize the position?**
A: Change the `position` prop on `<Toaster />` or in individual toast calls: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`

**Q: Can I dismiss toasts programmatically?**
A: Yes! Save the toast ID and call `notificationService.dismissToast(id)`

**Q: How do I limit the number of visible toasts?**
A: Set on `<Toaster />`: `<Toaster toastOptions={{ ...options, limit: 3 }} />`

**Q: Can I use this with server-side rendering?**
A: Yes, react-hot-toast works with SSR frameworks like Next.js.

---

## 📝 Notes for LLM Implementation

When implementing this pattern:

1. **Start with the service file** - This is the foundation
2. **Add the Toaster component** - Without this, nothing will render
3. **Update mutations incrementally** - Start with one feature (stocks), then expand
4. **Test thoroughly** - Ensure toasts appear correctly in all scenarios
5. **Consider accessibility** - react-hot-toast handles this well by default
6. **Don't over-notify** - Not every action needs a toast
7. **Maintain consistency** - Use the message constants for uniform messaging

---

## ✅ Success Criteria

You'll know the implementation is successful when:

- ✅ Stock creation shows success toast
- ✅ Stock update shows success toast
- ✅ Stock deletion shows success toast
- ✅ All errors show appropriate error toasts
- ✅ Force logout shows warning/info toast
- ✅ Toasts are visually consistent
- ✅ Toasts don't stack excessively
- ✅ Loading states are handled properly
- ✅ Toasts are accessible (keyboard/screen reader)

---

**Document Version:** 1.0.0  
**Last Updated:** February 3, 2026  
**Author:** GitHub Copilot  
**Status:** Ready for Implementation
