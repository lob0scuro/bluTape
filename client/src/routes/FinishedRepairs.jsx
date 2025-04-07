import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchAllMachines } from "../utils.jsx";

const FinishedRepairs = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchAllMachines(0, 1);
      setMachines(repairs);
    };
    fetchRepairs();
  }, []);

  return (
    <>
      <h1>Finished Repairs</h1>
      <Table machines={machines} />
    </>
  );
};

export default FinishedRepairs;
