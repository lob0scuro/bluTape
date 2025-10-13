import styles from "./Table.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../buttons/Button";

const Table = ({ machine_status }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const get = async () => {
      try {
        const response = await fetch(
          `/api/read/get_machines/${machine_status}?page=${page}&per_page=${perPage}`, // add this line to search by user --> ?created_by=${user.id},
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "aplication/json",
            },
          }
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setMachines(data.data);
        setTotalPages(data.meta.total_pages);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };
    get();
  }, [machine_status, page, perPage]);
  return (
    <>
      <div className={styles.pageControls}>
        <Button
          label={"prev"}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        />
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          label={"next"}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        />
      </div>
      <table className={styles.masterTable}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr
              key={machine.id}
              onClick={() => navigate(`/card/${machine.id}`)}
            >
              <td>{machine.brand}</td>
              <td>{machine.model}</td>
              <td>{machine.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
