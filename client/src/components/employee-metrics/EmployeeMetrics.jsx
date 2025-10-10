import styles from "./EmployeeMetrics.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/Tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCircleCheck,
  faForwardStep,
  faScrewdriverWrench,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../buttons/Button";

const EmployeeMetrics = ({ user }) => {
  const today = new Date().toISOString().split("T")[0];
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [month, setMonth] = useState(today.split("-")[1]);
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const fetchUserMetrics = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `/api/read/get_user_metrics/${user.id}?start=${start}&end=${end}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!ignore && data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.message || "Failed to fetch user metrics.");
        }
      }
    };
    fetchUserMetrics();
    return () => {
      ignore = true;
    };
  }, [user, start, end]);

  useEffect(() => {
    const monthStr = start.split("-")[1];
    setMonth(monthStr);
  }, [start]);

  const setDate = (direction) => {
    let newStart, newEnd;

    const today = new Date(start); // base date — current selection

    switch (direction) {
      // --- DAY NAVIGATION ---
      case "prev":
        newStart = new Date(today);
        newStart.setDate(today.getDate() - 1);
        newEnd = new Date(newStart);
        break;

      case "next":
        newStart = new Date(today);
        newStart.setDate(today.getDate() + 1);
        newEnd = new Date(newStart);
        break;

      // --- WEEK NAVIGATION ---
      case "prev-week": {
        const current = new Date(today);
        current.setDate(current.getDate() - 7); // move one week back
        const dayOfWeek = current.getDay(); // 0=Sunday

        // set to Sunday of that week
        newStart = new Date(current);
        newStart.setDate(current.getDate() - dayOfWeek);

        // Saturday = Sunday + 6
        newEnd = new Date(newStart);
        newEnd.setDate(newStart.getDate() + 6);
        break;
      }

      case "next-week": {
        const current = new Date(today);
        current.setDate(current.getDate() + 7); // move one week forward
        const dayOfWeek = current.getDay();

        newStart = new Date(current);
        newStart.setDate(current.getDate() - dayOfWeek);
        newEnd = new Date(newStart);
        newEnd.setDate(newStart.getDate() + 6);
        break;
      }

      // --- DEFAULT: TODAY ---
      default:
        newStart = new Date();
        newEnd = new Date();
    }

    const format = (d) => d.toISOString().split("T")[0];
    setStart(format(newStart));
    setEnd(format(newEnd));
  };

  const selectedMonth = (e) => {
    const selected = e.target.value;
    if (!selected) return;

    const year = new Date(start).getFullYear();
    const firstDay = `${year}-${selected}-01`;
    const lastDay = new Date(year, parseInt(selected), 0).getDate(); // 0 gets last day of previous month
    const lastDate = `${year}-${selected}-${
      lastDay < 10 ? "0" + lastDay : lastDay
    }`;

    setStart(firstDay);
    setEnd(lastDate);
    setMonth(selected);
  };

  const printMetrics = async () => {
    try {
      const response = await fetch(`/api/export/print_employee_metrics`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_name: user.first_name,
          metrics: metrics,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        throw new Error("Failed to print metrics.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to print metrics.");
      return;
    }
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
      </div>
      <div className={styles.monthPicker}>
        <select
          name="month-view"
          id="month-view"
          value={month}
          onChange={selectedMonth}
        >
          <option value="">-- Select Month --</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className={styles.weekButtons}>
        <Button label={"Prev Week"} onClick={() => setDate("prev-week")} />
        <Button label={"Next Week"} onClick={() => setDate("next-week")} />
      </div>

      <div className={styles.dayButtons}>
        <Button
          label={<FontAwesomeIcon icon={faBackwardStep} />}
          onClick={() => setDate("prev")}
        />
        <Button
          onClick={() => setDate("today")}
          label="Today"
          className={styles.todayButton}
        />
        <Button
          label={<FontAwesomeIcon icon={faForwardStep} />}
          onClick={() => setDate("next")}
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
      <Button
        label={"Print Metrics"}
        className={styles.printMetricsButton}
        onClick={printMetrics}
      />
    </div>
  );
};

export default EmployeeMetrics;
