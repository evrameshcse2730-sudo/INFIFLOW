import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Verifying access...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;