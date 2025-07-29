import styles from "./MachineBar.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMachines } from "../utils/API";
import toast from "react-hot-toast";
import clsx from "clsx";

const MachineBar = ({ setTypeId }) => {
  const [active, setActive] = useState(0);
  const set = (n) => {
    setTypeId(n);
    setActive(n);
  };
  return (
    <div className={styles.machineBar}>
      <button
        className={clsx(active === 1 && styles.active)}
        onClick={() => set(1)}
      >
        Fridge
      </button>
      <button
        className={clsx(active === 2 && styles.active)}
        onClick={() => set(2)}
      >
        Washer
      </button>
      <button
        className={clsx(active === 3 && styles.active)}
        onClick={() => set(3)}
      >
        Dryer
      </button>
      <button
        className={clsx(active === 4 && styles.active)}
        onClick={() => set(4)}
      >
        Range
      </button>
      <button
        className={clsx(active === 0 && styles.active)}
        onClick={() => set(0)}
      >
        All
      </button>
    </div>
  );
};

export default MachineBar;
