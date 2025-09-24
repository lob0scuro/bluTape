import styles from "./Table.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Table = ({ machine_status = "all" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const get = async () => {
      try {
        const response = await fetch(
          `/api/read/get_machines/${machine_status}?created_by=${user.id}`,
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
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };
    get();
  }, [machine_status]);
  return (
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
          <tr key={machine.id} onClick={() => navigate(`/card/${machine.id}`)}>
            <td>{machine.brand}</td>
            <td>{machine.model}</td>
            <td>{machine.color}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
