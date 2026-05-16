import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  if (!isAuthenticated) return <Navigate to="/select-role" replace />;
  if (!isAdmin) return <Navigate to="/select-role" replace />;
  return children;
};

export default AdminProtectedRoute;
