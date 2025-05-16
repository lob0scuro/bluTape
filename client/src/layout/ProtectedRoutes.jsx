import React from "react";
import { useAuth } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
