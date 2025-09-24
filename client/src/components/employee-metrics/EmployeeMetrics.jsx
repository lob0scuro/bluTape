// import styles from "./EmployeeMetrics.module.css";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const EmployeeMetrics = ({ uid }) => {
//   const [employee, setEmployee] = useState({});
//   const [viewRange, setViewRange] = useState("day"); // day, week, month
//   const [chartData, setChartData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // Fetch employee
//   useEffect(() => {
//     if (uid === 0) return;

//     const fetchEmployee = async () => {
//       try {
//         const response = await fetch(
//           `/api/read/get_user/${uid}?view_range=${viewRange}&selected_date=${
//             selectedDate.toISOString().split("T")[0]
//           }`,
//           {
//             method: "GET",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//         const data = await response.json();
//         if (!data.success) throw new Error(data.message);
//         setEmployee(data.data);
//       } catch (error) {
//         console.error(error);
//         toast.error(error.message);
//       }
//     };
//     fetchEmployee();
//   }, [uid, selectedDate]);

//   // Update chart based on viewRange
//   useEffect(() => {
//     if (!employee.metrics_timeline) return;

//     // Filter timeline based on viewRange
//     const timeline = employee.metrics_timeline;
//     let filteredTimeline = [];

//     if (viewRange === "day") {
//       filteredTimeline = timeline.slice(-1); // last day
//     } else if (viewRange === "week") {
//       filteredTimeline = timeline.slice(-7); // last 7 days
//     } else if (viewRange === "month") {
//       filteredTimeline = timeline.slice(-30); // last 30 days
//     }

//     const mergedData = filteredTimeline.map((entry) => ({
//       date: entry.date,
//       completed: entry.completed,
//       in_progress: entry.in_progress,
//       trashed: entry.trashed,
//     }));

//     setChartData(mergedData);
//   }, [employee, viewRange]);

//   // inside EmployeeMetrics.jsx, just before your JSX
//   const getRangeTotals = () => {
//     if (!employee.metrics_timeline)
//       return { completed: 0, in_progress: 0, trashed: 0 };

//     let rangeTimeline = [];
//     if (viewRange === "day")
//       rangeTimeline = employee.metrics_timeline.slice(-1);
//     if (viewRange === "week")
//       rangeTimeline = employee.metrics_timeline.slice(-7);
//     if (viewRange === "month")
//       rangeTimeline = employee.metrics_timeline.slice(-30);

//     return rangeTimeline.reduce(
//       (acc, entry) => ({
//         completed: acc.completed + entry.completed,
//         in_progress: acc.in_progress + entry.in_progress,
//         trashed: acc.trashed + entry.trashed,
//       }),
//       { completed: 0, in_progress: 0, trashed: 0 }
//     );
//   };
//   const metricsRange = getRangeTotals();

//   if (uid === 0) return null;

//   return (
//     <div className={styles.metricsContainer}>
//       <div style={{ margin: "0rem 0" }}>
//         <label htmlFor="viewRange">View by: </label>
//         <select
//           id="viewRange"
//           value={viewRange}
//           onChange={(e) => setViewRange(e.target.value)}
//         >
//           <option value="day">Day</option>
//           <option value="week">Week</option>
//           <option value="month">Month</option>
//         </select>
//       </div>
//       {viewRange === "day" && (
//         <div className={styles.datePicker}>
//           <label htmlFor="selectedDate">Select Date:</label>
//           <input
//             type="date"
//             name="selectedDate"
//             id="selectedDate"
//             value={selectedDate.toISOString().split("T")[0]}
//             onChange={(e) => setSelectedDate(new Date(e.target.value))}
//           />
//         </div>
//       )}

//       {/* Basic Stats */}
//       <div className={styles.statBlock}>
//         <h3>{viewRange.charAt(0).toUpperCase() + viewRange.slice(1)} Status</h3>
//         <ul>
//           <li>In Progress: {metricsRange.in_progress || 0}</li>
//           <li>Completed: {metricsRange.completed || 0}</li>
//           <li>Trashed: {metricsRange.trashed || 0}</li>
//         </ul>
//       </div>

//       {/* Status Breakdown for selected range */}
//       <div className={styles.statBlock}>
//         <h3>{viewRange.charAt(0).toUpperCase() + viewRange.slice(1)} Status</h3>
//         <ul>
//           <li>In Progress: {metricsRange.in_progress || 0}</li>
//           <li>Completed: {metricsRange.completed || 0}</li>
//           <li>Trashed: {metricsRange.trashed || 0}</li>
//         </ul>
//       </div>

//       {/* Currently Working On */}
//       <div className={styles.statBlock}>
//         <h3>Currently Working On</h3>
//         <ul>
//           {employee.current_workload?.map((m) => (
//             <li key={m.id}>
//               ({m.serial}) - {m.brand} {m.type_of}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chart */}
//       <div className={styles.statBlock}>
//         <h3>
//           {viewRange.charAt(0).toUpperCase() + viewRange.slice(1)} Machines by
//           Status
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="completed" stroke="#28a745" />
//             <Line type="monotone" dataKey="in_progress" stroke="#007bff" />
//             <Line type="monotone" dataKey="trashed" stroke="#dc3545" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default EmployeeMetrics;

import styles from "./EmployeeMetrics.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const EmployeeMetrics = ({ uid }) => {
  const [employee, setEmployee] = useState({});
  const [viewRange, setViewRange] = useState("day"); // day, week, month
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch employee metrics
  useEffect(() => {
    if (uid === 0) return;

    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `/api/read/get_user/${uid}?view_range=${viewRange}&selected_date=${
            selectedDate.toISOString().split("T")[0]
          }`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setEmployee(data.data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };

    fetchEmployee();
  }, [uid, viewRange, selectedDate]);

  // Prepare chart data
  useEffect(() => {
    if (!employee.metrics_timeline) return;

    const timeline = employee.metrics_timeline;
    let filteredTimeline = [];

    if (viewRange === "day") {
      filteredTimeline = timeline.filter(
        (entry) => entry.date === selectedDate.toISOString().split("T")[0]
      );
    } else if (viewRange === "week") {
      filteredTimeline = timeline.slice(-7);
    } else if (viewRange === "month") {
      filteredTimeline = timeline.slice(-30);
    }

    // Use filteredTimeline directly to show trends
    setChartData(filteredTimeline);
  }, [employee, viewRange, selectedDate]);

  // Compute totals for basic stats
  const getRangeTotals = () => {
    if (!employee.metrics_timeline)
      return { completed: 0, in_progress: 0, trashed: 0 };

    let rangeTimeline = [];
    if (viewRange === "day") {
      rangeTimeline = employee.metrics_timeline.filter(
        (entry) => entry.date === selectedDate.toISOString().split("T")[0]
      );
    } else if (viewRange === "week") {
      rangeTimeline = employee.metrics_timeline.slice(-7);
    } else if (viewRange === "month") {
      rangeTimeline = employee.metrics_timeline.slice(-30);
    }

    return rangeTimeline.reduce(
      (acc, entry) => ({
        completed: acc.completed + entry.completed,
        in_progress: acc.in_progress + entry.in_progress,
        trashed: acc.trashed + entry.trashed,
      }),
      { completed: 0, in_progress: 0, trashed: 0 }
    );
  };

  const metricsRange = getRangeTotals();

  if (uid === 0) return null;

  return (
    <div className={styles.metricsContainer}>
      {/* View selector */}
      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="viewRange">View by: </label>
        <select
          id="viewRange"
          value={viewRange}
          onChange={(e) => setViewRange(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Date picker for day view */}
      {viewRange === "day" && (
        <div className={styles.datePicker}>
          <label htmlFor="selectedDate">Select Date:</label>
          <input
            type="date"
            id="selectedDate"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      )}

      {/* Basic Stats */}
      <div className={styles.statBlock}>
        <h3>{viewRange.charAt(0).toUpperCase() + viewRange.slice(1)} Status</h3>
        <ul>
          <li>In Progress: {metricsRange.in_progress || 0}</li>
          <li>Completed: {metricsRange.completed || 0}</li>
          <li>Trashed: {metricsRange.trashed || 0}</li>
        </ul>
      </div>

      {/* Currently Working On */}
      <div className={styles.statBlock}>
        <h3>Currently Working On</h3>
        <ul>
          {employee.current_workload?.map((m) => (
            <li key={m.id}>
              ({m.serial}) - {m.brand} {m.type_of}
            </li>
          ))}
        </ul>
      </div>

      {/* Chart */}
      <div className={styles.statBlock}>
        <h3>
          {viewRange.charAt(0).toUpperCase() + viewRange.slice(1)} Machines by
          Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#28a745" />
            <Line type="monotone" dataKey="in_progress" stroke="#007bff" />
            <Line type="monotone" dataKey="trashed" stroke="#dc3545" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeMetrics;
