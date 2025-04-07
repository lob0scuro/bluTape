import styles from "../style/RepairCard.module.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOneMachine, formatDate } from "../utils.jsx";

const machineMap = {
  0: "Refrigerator",
  1: "Washer",
  2: "Dryer",
  3: "Range",
};

const RepairCard = () => {
  const { id, typeOf } = useParams();
  const [machine, setMachine] = useState({});

  useEffect(() => {
    const fetchMachine = async () => {
      const fetchedMachine = await fetchOneMachine(typeOf, id);
      setMachine(fetchedMachine);
    };
    fetchMachine();
  }, []);

  return (
    <>
      <h1>{machineMap[typeOf]}</h1>
      <div className={styles.mainCardBlock}>
        <ul className={styles.cardInfo}>
          <li>
            ID: <small>{machine.id}</small>
          </li>
          <li>
            Brand: <small>{machine.brand}</small>
          </li>
          <li>
            Model: <small>{machine.model}</small>
          </li>
          <li>
            Serial: <small>{machine.serial}</small>
          </li>
          <li>
            Color: <small>{machine.color}</small>
          </li>
          <li>
            Style: <small>{machine.style}</small>
          </li>
          <li>
            Condition: <small>{machine.condition}</small>
          </li>
          {machine.heat_type && (
            <li>
              Heat Type: <small>{machine.heat_type}</small>
            </li>
          )}
          <li>
            Started On: <small>{formatDate(machine.created_on)}</small>
          </li>
        </ul>
        <div>
          <ul className={styles.machineNotes}>
            <h3>Notes</h3>
            {machine.notes?.map((note, index) => (
              <li key={index}>{note.content}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RepairCard;
