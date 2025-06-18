import React from "react";
import { useAuth } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
