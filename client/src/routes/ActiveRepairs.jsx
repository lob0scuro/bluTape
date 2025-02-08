import styles from "./ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { renderData } from "../Tools";
import { fetchMachines } from "../api/Calls";

const ActiveRepairs = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetchMachines("get_machines", setMachines);
  }, [navigate]);

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
            <tbody>{renderData(machines)}</tbody>
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
