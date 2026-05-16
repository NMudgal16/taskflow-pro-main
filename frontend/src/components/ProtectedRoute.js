import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // When not authenticated, send users to role selection first
  return isAuthenticated ? children : <Navigate to="/select-role" replace />;
};

export default ProtectedRoute;
