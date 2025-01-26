import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./InventoryList.module.css";
import * as XLSX from "xlsx";

const InventoryList = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch("/api/get_inventory")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines(data.machines);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const exportTable = () => {
    const data = machines.map((machine) => ({
      date: new Date().toDateString("en-US"),
      id: machine.id,
      make: machine.make,
      model: machine.model,
      serial: machine.serial,
      style: machine.style,
      color: machine.color,
    }));

    const headers = [
      "Date",
      "ID",
      "Make",
      "Model No.",
      "Serial No.",
      "Style",
      "Color",
    ];
    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
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
    const blob = new Blob([
      wbBlob,
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ]);
    const formData = new FormData();
    formData.append("file", blob, "InventoryLog.xlsx");

    try {
      fetch("/api/send_email", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application.json",
        // },
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

    XLSX.writeFile(wb, "InventorySheet.xlsx");
  };

  const renderList = machines.map((machine) => (
    <tr key={machine.id}>
      <td>
        <Link to={`/edit-machine/${machine.id}`}>{machine.make}</Link>
      </td>
      <td>{machine.model}</td>
      <td className={machine.color}>{machine.style}</td>
    </tr>
  ));

  return (
    <>
      <h1 className={styles.inventoryHeader}>Inventory List</h1>
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
      <button onClick={exportTable} className={styles.exportButton}>
        Export
      </button>
    </>
  );
};

export default InventoryList;
