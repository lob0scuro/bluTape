import styles from "../style/ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchAllMachines, fetchAllMachinesByType } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";

const ActiveRepairs = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [chosenTable, setChosenTable] = useState([]);

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 0);
      if (repairs.success) {
        setMachines(repairs.data);
        setChosenTable(repairs.data);
      } else {
        setMachines([]);
        setChosenTable([]);
      }
    };
    fetchRepairs();
  }, []);

  const renderTable = async (t) => {
    const table = await fetchAllMachinesByType(0, 0, t);
    if (table.success) {
      setChosenTable(table.data);
    } else {
      setChosenTable([]);
    }
  };

  return (
    <>
      <div className={styles.activeTableButtonGroup}>
        <button onClick={() => renderTable(0)}>Fridges</button>
        <button onClick={() => renderTable(1)}>Washers</button>
        <button onClick={() => renderTable(2)}>Dryers</button>
        <button onClick={() => renderTable(3)}>Ranges</button>
        <button onClick={() => setChosenTable(machines)}>All</button>
      </div>
      <br />
      {machines ? <Table machines={chosenTable} /> : <h3>No machines found</h3>}
    </>
  );
};

export default ActiveRepairs;
