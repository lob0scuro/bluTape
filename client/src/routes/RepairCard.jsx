import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RepairCard = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState({});

  useEffect(() => {}, []);

  return (
    <>
      <h1>Repair Card {id}</h1>
    </>
  );
};

export default RepairCard;
