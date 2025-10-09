import styles from "./EmployeeMetrics.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/Tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faScrewdriverWrench,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../buttons/Button";

const EmployeeMetrics = ({ user }) => {
  const today = new Date().toISOString().split("T")[0];
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

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

  const setDateToToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setStart(today);
    setEnd(today);
  };

  if (!user) {
    return (
      <p style={{ fontSize: "1.2rem", marginTop: "1rem", fontStyle: "italic" }}>
        Please select a user.
      </p>
    );
  }

  if (!metrics) return <p>Loading metrics...</p>;
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
        <Button
          onClick={setDateToToday}
          label="Today"
          className={styles.todayButton}
        />
      </div>
      <div className={styles.metricResultsContainer}>
        <h2>
          Current Workload{" "}
          <FontAwesomeIcon
            icon={faScrewdriverWrench}
            style={{ color: "var(--buttonSecondary)" }}
          />
        </h2>
        <ul className={styles.metrics_list}>
          {metrics?.in_progress.map((machine) => (
            <li
              key={machine.id}
              onClick={() => navigate(`/card/${machine.id}`)}
            >
              {machine.brand.toUpperCase()} - {machine.style} | {machine.serial}
            </li>
          ))}
        </ul>
        <br />
        <p>Total: {metrics.in_progress.length}</p>
      </div>

      <div className={styles.metricResultsContainer}>
        <h2>
          Completed between{" "}
          <FontAwesomeIcon
            icon={faCircleCheck}
            style={{ color: "green", fontSize: "1.1rem" }}
          />{" "}
          <br />{" "}
          <span className={styles.dateSpan}>
            {formatDate(start)} and {formatDate(end)}
          </span>
        </h2>
        <ul className={styles.metrics_list}>
          {metrics?.completed_in_range.map((machine) => (
            <li
              key={machine.id}
              onClick={() => navigate(`/card/${machine.id}`)}
            >
              {machine.brand.toUpperCase()} - {machine.style} | {machine.serial}
            </li>
          ))}
        </ul>
        <br />
        <p>Total: {metrics.completed_in_range.length}</p>
      </div>
      <div className={styles.metricResultsContainer}>
        <h2>
          Trashed between{" "}
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "red", fontSize: "1.1rem" }}
          />
          <br />{" "}
          <span className={styles.dateSpan}>
            {formatDate(start)} and {formatDate(end)}
          </span>
        </h2>
        <ul className={styles.metrics_list}>
          {metrics?.trashed_in_range.map((machine) => (
            <li
              key={machine.id}
              onClick={() => navigate(`/card/${machine.id}`)}
            >
              {machine.brand.toUpperCase()} - {machine.style} | {machine.serial}
            </li>
          ))}
        </ul>
        <br />
        <p>Total: {metrics.trashed_in_range.length}</p>
      </div>
      <div className={styles.summaryContainer}>
        <h2>{metrics ? metrics.in_progress.length : 0} </h2>
        <p>Machines Currently In Progress</p>
      </div>
      <div className={styles.summaryContainer}>
        <h2>{metrics ? metrics.count_completed_trashed : 0} </h2>
        <p>Machines Worked On Between</p>
        <p>
          {formatDate(start)} and {formatDate(end)}
        </p>
      </div>
    </div>
  );
};

export default EmployeeMetrics;
