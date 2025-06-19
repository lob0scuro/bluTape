import styles from "./Table.module.css";
import React, { useEffect, useState } from "react";
import { fetchExportedMachines, fetchMachines } from "../utils/API";
import toast from "react-hot-toast";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Table = ({ endpoint, type_id }) => {
  const [machines, setMachines] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const get = async () => {
      const got = await fetchMachines(endpoint, type_id);
      if (!got.success) {
        toast.error(got.error);
      }
      setMachines(got.machines);
    };
    get();
  }, [type_id]);

  const toCard = (id) => {
    navigate(`/card/${id}`);
  };
  return (
    <div className={styles.tableBlock}>
      {machines?.length > 0 ? (
        <table className={styles.machineTable}>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Style</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(({ id, brand, model, style }) => (
              <tr key={id} onClick={() => toCard(id)}>
                <td>{brand}</td>
                <td>{model}</td>
                <td>{style}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>No machines found</p>
      )}
    </div>
  );
};

export default Table;
