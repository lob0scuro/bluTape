import styles from "../style/FinishedRepairs.module.css";
import React, { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import {
  fetchAllMachines,
  fetchAllMachinesByType,
  exportToExcel,
  formatDate,
} from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const FinishedRepairs = () => {
  const [machines, setMachines] = useState([]);
  const { user } = useAuth();
  const [chosenTable, setChosenTable] = useState(null);
  const [activeButton, setActiveButton] = useState();
  const today = new Date();
  const currentDate = formatDate(today).replace(/ /g, "_");

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 1);
      if (repairs.success) {
        setMachines(repairs.data);
        setChosenTable(repairs.data);
      } else {
        setMachines([]);
        setChosenTable([]);
      }
    };
    fetchRepairs();
  }, []);

  const renderTable = async (t) => {
    const table = await fetchAllMachinesByType(0, 1, t);
    if (table.success) {
      setChosenTable(table.data);
      setActiveButton(t);
    } else {
      setChosenTable([]);
    }
  };

  const deleteFinishedRepairs = async (ids) => {
    try {
      const response = await fetch("/delete/delete_on_export", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: ids }),
      });
      const data = response.json();
      if (!response.ok) {
        toast.error(data.error);
        return data.error;
      }
      toast.success(data.mesage);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.finishedTableButtonGroup}>
        <button
          className={activeButton === 0 ? styles.activeButton : ""}
          onClick={() => renderTable(0)}
        >
          Fridges
        </button>
        <button
          className={activeButton === 1 ? styles.activeButton : ""}
          onClick={() => renderTable(1)}
        >
          Washers
        </button>
        <button
          className={activeButton === 2 ? styles.activeButton : ""}
          onClick={() => renderTable(2)}
        >
          Dryers
        </button>
        <button
          className={activeButton === 3 ? styles.activeButton : ""}
          onClick={() => renderTable(3)}
        >
          Ranges
        </button>
        <button onClick={() => setChosenTable(machines)}>All</button>
      </div>
      {machines.length !== 0 ? (
        <div className={styles.finishedTableBlock}>
          <Table machines={chosenTable} />
          {user.is_admin && (
            <button
              className={styles.exportButton}
              onClick={() => {
                exportToExcel({
                  data: chosenTable.map(
                    ({ id, brand, model, serial, vendor, condition }) => ({
                      ID: id,
                      Brand: brand,
                      Model: model,
                      Serial: serial,
                      Vendor: vendor,
                      Condition: condition,
                    })
                  ),
                  filename: `Finished_Repairs_${currentDate}.xlsx`,
                });

                const isToDelete = chosenTable.map((machine) => machine.id);
                deleteFinishedRepairs(isToDelete);
                // Show a success toast after export
                toast.success("File has been exported!");
              }}
            >
              Export
            </button>
          )}
        </div>
      ) : (
        <h1>No Machines found</h1>
      )}
    </>
  );
};

export default FinishedRepairs;
