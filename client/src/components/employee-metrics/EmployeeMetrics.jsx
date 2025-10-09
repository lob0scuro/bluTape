import styles from "./EmployeeMetrics.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EmployeeMetrics = ({ user }) => {
  const today = new Date().toISOString().split("T")[0];
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `/api/read/get_user_metrics/${user.id}?start=${start}&end=${end}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message);
          }
          toast.success("Fetched user metrics.");
          console.log(data.data);
          setMetrics(data.data);
        } else {
          throw new Error("Failed to fetch user metrics.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }
    };
    fetchUserMetrics();
  }, [user, start, end]);
  if (!user) {
    return (
      <p style={{ fontSize: "1.2rem", marginTop: "1rem", fontStyle: "italic" }}>
        Please select a user.
      </p>
    );
  }
  return (
    <div className={styles.metricsContainer}>
      <div className={styles.datePicker}>
        <label htmlFor="start">
          Start Date:
          <input
            type="date"
            name="start"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label htmlFor="end">
          End Date:
          <input
            type="date"
            name="end"
            id="end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default EmployeeMetrics;
