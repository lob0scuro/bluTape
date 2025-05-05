import styles from "../style/ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchAllMachines, fetchAllMachinesByType } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";

const ActiveRepairs = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [chosenTable, setChosenTable] = useState([]);
  const [activeButton, setActiveButton] = useState(user.role);

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
      setActiveButton(t);
    } else {
      setChosenTable([]);
      setActiveButton(null);
    }
  };

  return (
    <>
      <div className={styles.activeTableButtonGroup}>
        <button
          className={activeButton === 0 ? styles.activeButton : ""}
          onClick={() => renderTable(0)}
        >
          Fridges
        </button>
        <button
          className={activeButton === 1 ? styles.activeButton : ""}
          onClick={() => renderTable(1)}
        >
          Washers
        </button>
        <button
          className={activeButton === 2 ? styles.activeButton : ""}
          onClick={() => renderTable(2)}
        >
          Dryers
        </button>
        <button
          className={activeButton === 3 ? styles.activeButton : ""}
          onClick={() => renderTable(3)}
        >
          Ranges
        </button>
        <button onClick={() => setChosenTable(machines)}>All</button>
      </div>
      <br />
      {machines ? <Table machines={chosenTable} /> : <h3>No machines found</h3>}
    </>
  );
};

export default ActiveRepairs;
