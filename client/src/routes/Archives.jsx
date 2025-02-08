import styles from "./Archives.module.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { renderData } from "../Tools";
import { fetchMachines } from "../api/Calls";

const Archives = () => {
  const [machines, setMachines] = useState([]);
  const [queryDate, setQueryDate] = useState("");

  useEffect(() => {
    fetchMachines("get_archives", setMachines);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(queryDate);
  };

  return (
    <>
      {machines.length !== 0 ? (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="date">Search Archives by Date</label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={(e) => setQueryDate(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <h1 className={styles.archiveHeader}>Archives</h1>
          <table className={styles.archiveTable}>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>{renderData(machines)}</tbody>
          </table>
        </>
      ) : (
        <h1 style={styles.archiveDefault}>No archives recorded</h1>
      )}
    </>
  );
};

export default Archives;
