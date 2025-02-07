import styles from "./InventoryList.module.css";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../context/UserContext";

const InventoryList = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const { user } = useAuth();

  const fetchMachines = () => {
    fetch("/api/get_inventory")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines([...data.machines]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMachines();
  }, [navigate]);

  const exportTable = () => {
    let conf = confirm("Export data and archive machines?");
    if (!conf) {
      return;
    } else {
      const data = machines.map((machine) => [
        new Date().toDateString("en-US"),
        machine.id,
        machine.make,
        machine.model,
        machine.serial,
        machine.style,
        machine.color,
      ]);

      const archiveData = machines.map((machine) => ({ id: machine.id }));

      const headers = [
        ["Date", "ID", "Make", "Model No.", "Serial No.", "Style", "Color"],
      ];
      const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
      ws["!cols"] = [
        { wpx: 90 },
        { wpx: 25 },
        { wpx: 80 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 75 },
        { wpx: 75 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Log");

      const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbBlob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const formData = new FormData();
      formData.append("file", blob, "InventoryLog.xlsx");

      try {
        fetch("/api/send_email", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }

      try {
        fetch("/api/archive_machines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(archiveData),
        })
          .then((response) => {
            return response.json;
          })
          .then((data) => {
            console.log(data.message);
            fetchMachines();
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
        throw error;
      }

      XLSX.writeFile(wb, "InventorySheet.xlsx");
    }
  };

  const renderList = machines.map((machine) => (
    <tr key={machine.id}>
      <td>
        <Link to={`/repair-card/${machine.id}`}>{machine.make}</Link>
      </td>
      <td>{machine.model}</td>
      <td className={machine.color}>{machine.style}</td>
    </tr>
  ));

  return (
    <>
      {machines.length !== 0 ? (
        <>
          <h1 className={styles.inventoryHeader}>Finished Repairs</h1>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>{renderList}</tbody>
          </table>
          {["Ethan", "Jesse", "Matt", "Cameron"].includes(user.first_name) && (
            // <div className={styles.buttonBlock}>
            <button onClick={exportTable} className={styles.exportButton}>
              Export
            </button>
            // </div>
          )}
        </>
      ) : (
        <h1 className={styles.inventoryHeader}>
          All repairs have been archived
        </h1>
      )}
    </>
  );
};

export default InventoryList;
