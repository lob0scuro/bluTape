import styles from "./MachineTable.module.css";
import React, { useState } from "react";
import Button from "../../components/buttons/Button";
import Table from "../../components/table/Table";

const MachineTable = () => {
  const [machineStatus, setMachineStatus] = useState("in_progress");
  return (
    <div className={styles.tableContainer}>
      <div className={styles.statusSwitchBlock}>
        <input
          type="radio"
          name="machine_status"
          id="in_progress"
          value="in_progress"
          checked={machineStatus === "in_progress"}
          onChange={() => setMachineStatus("in_progress")}
        />
        <label htmlFor="in_progress">In Progress</label>

        <input
          type="radio"
          name="machine_status"
          id="completed"
          value="completed"
          checked={machineStatus === "completed"}
          onChange={() => setMachineStatus("completed")}
        />
        <label htmlFor="completed">Completed</label>

        <input
          type="radio"
          name="machine_status"
          id="trashed"
          value="trashed"
          checked={machineStatus === "trashed"}
          onChange={() => setMachineStatus("trashed")}
        />
        <label htmlFor="trashed">Trash</label>

        <input
          type="radio"
          name="machine_status"
          id="all"
          value={"all"}
          checked={machineStatus === "all"}
          onChange={() => setMachineStatus("all")}
        />
        <label htmlFor="all">All</label>
      </div>
      <div className={styles.machineTable}>
        <Table machine_status={machineStatus} />
      </div>
    </div>
  );
};

export default MachineTable;
