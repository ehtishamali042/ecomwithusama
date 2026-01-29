import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticatedUser = useAuthStore((state) => state.user) !== null;
  const location = useLocation();

  if (!isAuthenticatedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
