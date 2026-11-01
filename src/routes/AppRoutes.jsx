
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../admin/pages/AdminLogin/AdminLogin";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Home */}
      <Route
        path="/"
        element={<div>INIFLOW Home Page</div>}
      />

      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Protected Admin Pages */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />
      </Route>

      {/* Invalid Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
