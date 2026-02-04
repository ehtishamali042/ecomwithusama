import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { useAppInitPhase } from "@/hooks/useAppInitPhase";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticatedUser = useAuthStore((state) => state.user) !== null;
  const location = useLocation();
  const { initPhase } = useAppInitPhase();

  // MainRoutes already blocks on idle, authCheck, and error phases
  if (initPhase === "public" || !isAuthenticatedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Only allow children if ready and authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
