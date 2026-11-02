
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../admin/pages/AdminLogin/AdminLogin";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import CoursesManager from "../admin/pages/CoursesManager/CoursesManager";

import AdminLayout from "../admin/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PDFManager from "../admin/pages/PDFManager/PDFManager";
import ProjectsManager from "../admin/pages/ProjectsManager/ProjectsManager";
import Settings from "../admin/pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>INIFLOW Home Page</div>} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="pdfs" element={<PDFManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
