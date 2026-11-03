
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";

import AdminLogin from "../admin/pages/AdminLogin/AdminLogin";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import CoursesManager from "../admin/pages/CoursesManager/CoursesManager";
import ClassesManager from "../admin/pages/ClassesManager/ClassesManager";
import PDFManager from "../admin/pages/PDFManager/PDFManager";
import ProjectsManager from "../admin/pages/ProjectsManager/ProjectsManager";
import Settings from "../admin/pages/Settings/Settings";

import AdminLayout from "../admin/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import CoursesPage from "../pages/Courses/CoursesPage";
import CourseDetails from "../pages/Courses/CourseDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:slug" element={<CourseDetails />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="classes" element={<ClassesManager />} />
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
