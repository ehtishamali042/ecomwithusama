import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useUser } from "@/hooks/useUser";
import { useAppInitPhase } from "@/hooks/useAppInitPhase";
import { AppInitScreen } from "@/components/ui/AppInitScreen";
import { Loader } from "@/components/ui/Loader";

// Lazy load pages
const LoginPage = lazy(() => import("./auth/login"));
const RegisterPage = lazy(() => import("./auth/register"));
const DashboardRoutes = lazy(() => import("./dashboard"));
const NotFound = lazy(() => import("./NotFound"));

function MainRoutes() {
  const { user } = useUser();
  const location = useLocation();
  const { initPhase, phaseMessage, initUser } = useAppInitPhase();

  if (initPhase === "idle" || initPhase === "authCheck") {
    return (
      <AppInitScreen
        phase={initPhase}
        message={phaseMessage || "Authenticating..."}
      />
    );
  }
  if (initPhase === "error") {
    return (
      <AppInitScreen phase="error" message={phaseMessage} onRetry={initUser} />
    );
  }

  return (
    <Suspense fallback={<Loader size="lg" fullScreen />}>
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
