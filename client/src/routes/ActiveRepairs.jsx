import styles from "../style/ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchAllMachines, fetchAllMachinesByType } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";

const formTitles = ["Refrigerator", "Washer", "Dryer", "Range"];

const ActiveRepairs = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [chosenTable, setChosenTable] = useState();

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 0);
      setMachines(repairs);
      setChosenTable(repairs);
    };
    fetchRepairs();
  }, []);

  const renderTable = async (t) => {
    const table = await fetchAllMachinesByType(0, 0, t);
    setChosenTable(table);
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
      <h1>Active Repairs</h1>
      <Table machines={chosenTable} />
    </>
  );
};

export default ActiveRepairs;
