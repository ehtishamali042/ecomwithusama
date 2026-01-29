import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useUser } from "@/hooks/useUser";

// Lazy load pages
const LoginPage = lazy(() => import("./auth/login"));
const RegisterPage = lazy(() => import("./auth/register"));
const DashboardRoutes = lazy(() => import("./dashboard"));
const NotFound = lazy(() => import("./NotFound"));

function MainRoutes() {
  const { user } = useUser();
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" state={{ from: location }} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" state={{ from: location }} replace />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default MainRoutes;
