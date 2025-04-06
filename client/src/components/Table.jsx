import styles from "../style/Table.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Table = ({ machines }) => {
  const renderMachines = Array.isArray(machines)
    ? machines.map((machine) => (
        <tr key={machine.id}>
          <td className={styles.cardLink}>
            <Link to={`/card/${machine.id}/${0}`}>{machine.id}</Link>
          </td>
          <td>{machine.brand}</td>
          <td>{machine.style}</td>
          <td>{machine.model}</td>
        </tr>
      ))
    : [];

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
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
