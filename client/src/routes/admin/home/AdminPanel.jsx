import styles from "./AdminPanel.module.css";
import React, { useEffect, useState } from "react";
import Button from "../../../components/buttons/Button";
import EmployeeMetrics from "../../../components/employee-metrics/EmployeeMetrics";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [action, setAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/read/get_users`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setEmployees(data.data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }
    };
    fetchEmployee();
  }, []);

  const selectAction = (target) => {
    setAction(target);
    navigate(target);
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.adminControls}>
        <p>Actions: {action}</p>
        <div>
          <select
            name="actions"
            id="actions"
            onChange={(e) => selectAction(e.target.value)}
          >
            <option value="">--Select Action--</option>
            <option value="/register">Register New User</option>
            <option value="/employee-info">View Employee Info</option>
            <option value="/export">Export Machines</option>
          </select>
        </div>
      </div>
      <div className={styles.metricMaster}>
        <p>Select Employee to View Their Metrics</p>
        <br />
        <select
          name="users"
          id="users"
          className={styles.employeePicker}
          onChange={(e) => {
            const id = Number(e.target.value);

            setUser(id ? employees.find((emp) => emp.id === id) : null);
          }}
        >
          <option value={0}>--Select Employee--</option>
          {employees.map(({ id, first_name, last_name }) => (
            <option value={id} key={id}>
              {first_name} {last_name}
            </option>
          ))}
        </select>
        <EmployeeMetrics user={user} />
      </div>
    </div>
  );
};

export default AdminPanel;
