import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOneMachine } from "../utils.jsx";

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
      <h1>
        [{machine.id}] {machine.brand} {machineMap[machine.machine_type]}
      </h1>
    </>
  );
};

export default RepairCard;
