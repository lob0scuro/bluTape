import styles from "./Archives.module.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { renderData } from "../Tools";
import { fetchMachines } from "../api/Calls";

const Archives = () => {
  const [machines, setMachines] = useState([]);
  const [queryDate, setQueryDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMachines("get_archives", setMachines);
    if (error) {
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/archive_by_date/${queryDate}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.data && data.data.length !== 0) {
          setMachines(data.data);
        } else {
          setError(data.error);
          fetchMachines("get_archives", setMachines);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {machines.length !== 0 ? (
        <>
          <form className={styles.dateQuery} onSubmit={handleSubmit}>
            <label htmlFor="date">
              <b>Search Archives by Date</b>:&nbsp;
            </label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={(e) => setQueryDate(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <button
            onClick={() => fetchMachines("get_archives", setMachines)}
            className={styles.resetButton}
          >
            Reset Table
          </button>
          {error && <p className="error-text">{error}</p>}
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
