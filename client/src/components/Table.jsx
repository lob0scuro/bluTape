import styles from "./Table.module.css";
import React, { useEffect, useState } from "react";
import { fetchAllMachines } from "../utils/API";
import toast from "react-hot-toast";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Table = ({ status, type_id }) => {
  const [machines, setMachines] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const get = async () => {
      const got = await fetchAllMachines(status, type_id, page, limit);
      if (!got.success) {
        toast.error(got.error);
      }
      setMachines(got.machines || []);
      setTotal(got.total || 0);
    };
    get();
  }, [type_id, status, page, limit]);

  const toCard = (id) => {
    navigate(`/card/${id}`);
  };
  return (
    <div className={styles.tableBlock}>
      {machines?.length > 0 ? (
        <>
          <div className={styles.paginateBlock}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
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
        </>
      ) : (
        <p className={styles.noData}>No machines found</p>
      )}
    </div>
  );
};

export default Table;
