import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import SettingsPage from "@/features/settings/SettingsPage";
const UpdateProfile = lazy(() => import("./update-profile"));

export default function SettingsRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="update-profile" element={<UpdateProfile />} />
      </Routes>
    </Suspense>
  );
}
