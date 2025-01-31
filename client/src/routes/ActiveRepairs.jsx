import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ActiveRepairs.module.css";

const ActiveRepairs = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch("/api/get_machines")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderData = machines.map((machine) => (
    <tr key={machine.id}>
      <td>
        <Link to={`/repair-card/${machine.id}`}>{machine.make}</Link>
      </td>
      <td>{machine.model}</td>
      <td className={machine.color}>{machine.style}</td>
    </tr>
  ));

  return (
    <>
      <h1 className={styles.activeHeader}>Active Repairs</h1>
      <table className={styles.activeTable}>
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Style</th>
          </tr>
        </thead>
        <tbody>{renderData}</tbody>
      </table>
      <Link to="/start-repair" className={styles.addRepairButton}>
        Add Repair
      </Link>
    </>
  );
};

export default ActiveRepairs;
