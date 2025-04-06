import styles from "../style/ActiveRepairs.module.css";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { fetchActiveRepairs } from "../utils.jsx";

const ActiveRepairs = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchRepairs = async () => {
      const repairs = await fetchActiveRepairs(0);
      setMachines(repairs);
    };
    fetchRepairs();
  }, []);

  return (
    <>
      <h1>Active Repairs</h1>
      <Table machines={machines} />
    </>
  );
};

export default ActiveRepairs;
