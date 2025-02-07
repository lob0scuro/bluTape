import styles from "./ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ActiveRepairs = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  const fetchMachines = () => {
    fetch("/api/get_machines")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines([...data.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMachines();
  }, [navigate]);

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
      {machines.length !== 0 ? (
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
      ) : (
        <div className={styles.noDataBlock}>
          <br />
          <h1 className={styles.activeNoDataHeader}>No Active repairs</h1>
          <br />
          <Link to="/start-repair" className={styles.addRepairButton}>
            Add Repair
          </Link>
        </div>
      )}
    </>
  );
};

export default ActiveRepairs;
