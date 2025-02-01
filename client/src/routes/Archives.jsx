import styles from "./Archives.module.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Archives = () => {
  const [machines, setMachines] = useState([]);

  const fetchMachines = () => {
    try {
      fetch("/api/get_archives")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setMachines([...data]);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const renderList = machines.map((machine) => (
    <tr key={machine.id}>
      <td>{machine.make}</td>
      <td>{machine.model}</td>
      <td className={machine.color}>{machine.style}</td>
    </tr>
  ));

  return (
    <>
      {machines.length !== 0 ? (
        <>
          <h1 className={styles.archiveHeader}>Archives</h1>
          <table className={styles.archiveTable}>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>{renderList}</tbody>
          </table>
        </>
      ) : (
        <h1 style={styles.archiveDefault}>No archives recorded</h1>
      )}
    </>
  );
};

export default Archives;
