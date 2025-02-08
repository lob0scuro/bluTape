import styles from "./InventoryList.module.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { exportTable, fetchMachines } from "../api/Calls";
import { renderData } from "../Tools";

const InventoryList = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchMachines("get_inventory", setMachines);
  }, [navigate]);

  return (
    <>
      {machines.length !== 0 ? (
        <>
          <h1 className={styles.inventoryHeader}>Finished Repairs</h1>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>{renderData(machines)}</tbody>
          </table>
          {["Ethan", "Jesse", "Matt", "Cameron"].includes(user.first_name) && (
            <button
              onClick={() => exportTable(machines, fetchMachines)}
              className={styles.exportButton}
            >
              Export
            </button>
          )}
        </>
      ) : (
        <h1 className={styles.inventoryHeader}>
          All repairs have been archived
        </h1>
      )}
    </>
  );
};

export default InventoryList;
