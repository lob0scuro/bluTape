import styles from "../style/Table.module.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Table = ({ machines }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/card/${id}/${0}`);
  };

  const renderMachines = Array.isArray(machines)
    ? machines.map((machine) => (
        <tr key={machine.id} onClick={() => handleNavigate(machine.id)}>
          {/* <td>{machine.id}</td> */}
          <td>{machine.brand}</td>
          <td>{machine.style}</td>
          <td className={styles.modelRow}>{machine.model}</td>
        </tr>
      ))
    : [];

  if (machines.length === 0) {
    return (
      <>
        <h1>No machines found</h1>
      </>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Style</th>
          <th>Model</th>
        </tr>
      </thead>
      <tbody>{renderMachines}</tbody>
    </table>
  );
};

export default Table;
