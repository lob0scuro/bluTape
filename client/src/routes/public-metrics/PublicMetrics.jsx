import styles from "./PublicMetrics.module.css";
import React from "react";
import EmployeeMetrics from "../../components/employee-metrics/EmployeeMetrics";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const PublicMetrics = () => {
  const { user } = useAuth();
  return (
    <>
      <h1>{user.first_name}</h1>
      <EmployeeMetrics user={user} />
    </>
  );
};

export default PublicMetrics;
