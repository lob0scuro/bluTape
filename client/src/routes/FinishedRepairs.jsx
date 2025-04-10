import styles from "../style/FinishedRepairs.module.css";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchAllMachines, fetchAllMachinesByType } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const FinishedRepairs = () => {
  const [machines, setMachines] = useState([]);
  const { user } = useAuth();
  const [chosenTable, setChosenTable] = useState(null);

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 1);
      setMachines(repairs);
      setChosenTable(repairs);
    };
    fetchRepairs();
  }, []);

  const renderTable = async (t) => {
    const table = await fetchAllMachinesByType(0, 1, t);
    setChosenTable(table);
  };

  return (
    <>
      <div className={styles.finishedTableButtonGroup}>
        <button onClick={() => renderTable(0)}>Fridges</button>
        <button onClick={() => renderTable(1)}>Washers</button>
        <button onClick={() => renderTable(2)}>Dryers</button>
        <button onClick={() => renderTable(3)}>Ranges</button>
        <button onClick={() => setChosenTable(machines)}>All</button>
      </div>
      <h1>Finished Repairs</h1>
      {machines.length !== 0 ? (
        <div className={styles.finishedTableBlock}>
          <Table machines={chosenTable} />
          {user.is_admin && (
            <button className={styles.exportButton}>Export</button>
          )}
        </div>
      ) : (
        <h1>No Machines to show</h1>
      )}
    </>
  );
};

export default FinishedRepairs;
