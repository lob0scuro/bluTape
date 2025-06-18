import styles from "./MachineTable.module.css";
import Table from "../../components/Table";
import { useState } from "react";
import clsx from "clsx";

const MachineTable = () => {
  const [mType, setMType] = useState(0);

  const set = (n) => {
    setMType(n);
  };

  return (
    <>
      <div className={styles.tableButtonBlock}>
        <button
          onClick={() => set(1)}
          className={clsx(
            styles.tableBtn,
            mType === 1 && styles.tableBtnActive
          )}
        >
          Fridge
        </button>
        <button
          onClick={() => set(2)}
          className={clsx(
            styles.tableBtn,
            mType === 2 && styles.tableBtnActive
          )}
        >
          Washer
        </button>
        <button
          onClick={() => set(3)}
          className={clsx(
            styles.tableBtn,
            mType === 3 && styles.tableBtnActive
          )}
        >
          Dryer
        </button>
        <button
          onClick={() => set(4)}
          className={clsx(
            styles.tableBtn,
            mType === 4 && styles.tableBtnActive
          )}
        >
          Range
        </button>
        <button
          onClick={() => set(0)}
          className={clsx(
            styles.tableBtn,
            mType === 0 && styles.tableBtnActive
          )}
        >
          All
        </button>
      </div>
      <Table type_id={mType} />
    </>
  );
};

export default MachineTable;
