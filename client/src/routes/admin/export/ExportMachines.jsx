import styles from "./ExportMachines.module.css";
import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import Button from "../../../components/buttons/Button";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/Tools";
import { useNavigate } from "react-router-dom";

const ExportMachines = () => {
  const [machines, setMachines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      const response = await fetch("/api/read/get_machines/completed");
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      console.log(data.data);
      setMachines(data.data);
    };
    fetchMachines();
  }, []);

  const handleClick = (machine_id) => {
    navigate(`/card/${machine_id}`);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export/export_machines");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setMachines([]);
      return;
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }
  };

  return (
    <div className={styles.exportContainer}>
      <Button
        label={"Back to Admin Panel"}
        onClick={() => navigate("/admin-panel")}
      />
      <br />
      <ul className={styles.exportList}>
        {machines.map(
          ({
            id,
            brand,
            model,
            serial,
            type_of,
            creator_name,
            completed_on,
          }) => (
            <li key={id} onClick={() => handleClick(id)}>
              <div>
                <strong>
                  {brand} {type_of}
                </strong>
                <p>
                  Completed On: <br />
                  {formatDate(completed_on)}
                </p>
              </div>
              <div>
                <p>
                  Model: <br />
                  {model}
                </p>
                <p>
                  Serial: <br />
                  {serial}
                </p>
                <p>{creator_name}</p>
              </div>
            </li>
          )
        )}
      </ul>
      <Button
        label={"Export Machines"}
        onClick={handleExport}
        disabled={machines.length === 0}
      />
    </div>
  );
};

export default ExportMachines;
