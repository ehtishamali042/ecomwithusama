/**
 * Centralized notification messages
 */
export const NOTIFICATION_MESSAGES = {
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
  AUTH: {
    LOGOUT_SUCCESS: "Logged out successfully",
    SESSION_EXPIRED: "Your session has expired. Please login again.",
    FORCE_LOGOUT: "You have been logged out due to inactivity",
    UNAUTHORIZED: "You are not authorized to perform this action",
  },
  FILE: {
    UPLOAD_SUCCESS: "File uploaded successfully!",
    UPLOAD_ERROR: "Failed to upload file. Please try again.",
    UPLOAD_LOADING: "Uploading file...",
    INVALID_FILE_TYPE: "Invalid file type. Please upload a valid file.",
    FILE_TOO_LARGE: "File size exceeds maximum allowed size",
  },
  PROFILE: {
    UPDATE_SUCCESS: "Profile updated successfully!",
    UPDATE_ERROR: "Failed to update profile. Please try again.",
  },
  GENERIC: {
    NETWORK_ERROR: "Network error. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    OPERATION_SUCCESS: "Operation completed successfully",
  },
} as const;

export type NotificationMessages = typeof NOTIFICATION_MESSAGES;
