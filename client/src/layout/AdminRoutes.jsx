import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/buttons/Button";

const AdminRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <p>Loading...</p>;
  if (!user.is_admin)
    return (
      <>
        <h2>Admin Panel</h2>
        <p>Unauthorized Access</p>
        <Button label={"Return to home screen"} onClick={() => navigate("/")} />
      </>
    );
  return <Outlet />;
};

export default AdminRoutes;
