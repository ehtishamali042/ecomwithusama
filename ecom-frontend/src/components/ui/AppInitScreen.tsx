import React from "react";
import type { AppInitPhase } from "@/store/appStore";

export interface AppInitScreenProps {
  phase: AppInitPhase;
  message?: string;
  onRetry?: () => void;
}

export const AppInitScreen: React.FC<AppInitScreenProps> = ({
  phase,
  message,
  onRetry,
}) => {
  const isLoading = phase === "idle" || phase === "authCheck";
  const isError = phase === "error";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6">
        {/* Brand logo/wordmark */}
        <span className="text-3xl font-bold text-blue-600">EcomWithUsama</span>
      </div>
      {isLoading && (
        <div className="w-64 h-4 bg-gray-200 rounded-full animate-pulse mb-4" />
      )}
      <div className="text-lg text-gray-700 mb-2">
        {message || (isLoading ? "Preparing your dashboard..." : "")}
      </div>
      {isError && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};
