import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const ProtectedRoute = ({ element, exemptRoutes = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isExempt = exemptRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!user && !isExempt) {
    return <Navigate to="/login-page" state={{ from: location.pathname }} />;
  }

  return element;
};

export default ProtectedRoute;
