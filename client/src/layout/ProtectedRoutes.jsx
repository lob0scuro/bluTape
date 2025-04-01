import React from "react";
import { useAuth } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
