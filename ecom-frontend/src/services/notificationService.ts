import toast, { type ToastOptions } from "react-hot-toast";
import type { ReactNode } from "react";

const DEFAULT_CONFIG: ToastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    background: "#363636",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
};

const SUCCESS_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 3000,
  icon: "✅",
  style: { ...DEFAULT_CONFIG.style, background: "#10b981" },
};
const ERROR_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 5000,
  icon: "❌",
  style: { ...DEFAULT_CONFIG.style, background: "#ef4444" },
};
const WARNING_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 4000,
  icon: "⚠️",
  style: { ...DEFAULT_CONFIG.style, background: "#f59e0b" },
};
const INFO_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: 3500,
  icon: "ℹ️",
  style: { ...DEFAULT_CONFIG.style, background: "#3b82f6" },
};
const LOADING_CONFIG: ToastOptions = {
  ...DEFAULT_CONFIG,
  duration: Infinity,
  icon: "⏳",
};

export const notificationService = {
  showSuccess(message: string, options?: ToastOptions): string {
    return toast.success(message, { ...SUCCESS_CONFIG, ...options });
  },
  showError(message: string, options?: ToastOptions): string {
    return toast.error(message, { ...ERROR_CONFIG, ...options });
  },
  showWarning(message: string, options?: ToastOptions): string {
    return toast(message, { ...WARNING_CONFIG, ...options });
  },
  showInfo(message: string, options?: ToastOptions): string {
    return toast(message, { ...INFO_CONFIG, ...options });
  },
  showLoading(message: string, options?: ToastOptions): string {
    return toast.loading(message, { ...LOADING_CONFIG, ...options });
  },
  showPromise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
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
  dismissToast(toastId: string): void {
    toast.dismiss(toastId);
  },
  dismissAll(): void {
    toast.dismiss();
  },
  showCustom(content: ReactNode, options?: ToastOptions): string | number {
    return toast.custom(content, { ...DEFAULT_CONFIG, ...options });
  },
};

export type NotificationService = typeof notificationService;
