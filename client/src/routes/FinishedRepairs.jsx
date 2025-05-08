import styles from "../style/FinishedRepairs.module.css";
import React, { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import {
  fetchAllMachines,
  fetchAllMachinesByType,
  exportToExcel,
  formatDate,
  machineMap,
} from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const FinishedRepairs = () => {
  const [machines, setMachines] = useState([]);
  const { user } = useAuth();
  const [chosenTable, setChosenTable] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const today = new Date();
  const currentDate = formatDate(today).replace(/ /g, "_");

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 1);
      if (repairs.success) {
        setMachines(repairs.data);
        renderTable(100);
      } else {
        setMachines([]);
        setChosenTable([]);
      }
    };
    fetchRepairs();
  }, []);

  const renderTable = async (t) => {
    const all = await fetchAllMachines(0, 1);
    if (t === 100) {
      setChosenTable(all.data);
      setActiveButton(t);
      return;
    }
    const table = await fetchAllMachinesByType(0, 1, t);
    if (table.success) {
      setChosenTable(table.data);
      setActiveButton(t);
    } else {
      setChosenTable([]);
      setActiveButton(t);
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
        <button
          className={activeButton === 100 ? styles.activeButton : ""}
          onClick={() => renderTable(100)}
        >
          All
        </button>
      </div>
      {machines ? (
        <div className={styles.finishedTableBlock}>
          <Table machines={chosenTable} />
          {user.is_admin && (
            <button
              className={styles.exportButton}
              onClick={() => {
                exportToExcel({
                  data: chosenTable?.map(
                    ({
                      id,
                      machine_type,
                      style,
                      brand,
                      model,
                      serial,
                      vendor,
                      condition,
                      color,
                    }) => ({
                      ID: id,
                      Brand: brand,
                      Category: machineMap[machine_type],
                      Type: style,
                      Color: color,
                      Model: model,
                      Serial: serial,
                      Vendor: vendor,
                      Condition: condition,
                    })
                  ),
                  filename: `finishedRepairs_${currentDate}.xlsx`,
                });

                // const isToDelete = chosenTable.map((machine) => machine.id);
                // deleteFinishedRepairs(isToDelete);
                // Show a success toast after export
                toast.success("File has been exported!");
              }}
            >
              Export Table
            </button>
          )}
        </div>
      ) : (
        <h1>No Machines Found</h1>
      )}
    </>
  );
};

export default FinishedRepairs;
