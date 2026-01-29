import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import ProtectedRoute from "@/pages/ProtectedRoute";

const DashboardMain = lazy(() => import("./DashboardMain"));
const AllOrders = lazy(() => import("./orders/AllOrders"));
const OrderDetail = lazy(() => import("./orders/OrderDetail"));
const EditOrder = lazy(() => import("./orders/EditOrder"));
const Calculator = lazy(() => import("./calculator/Calculator"));
const SettingsRoutes = lazy(() => import("./settings/index"));

export default function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="" element={<DashboardMain />} />
            <Route path="orders" element={<AllOrders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="orders/:orderId/edit" element={<EditOrder />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="settings/*" element={<SettingsRoutes />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
