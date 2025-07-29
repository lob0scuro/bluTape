import { useEffect, useState } from "react";
import MachineBar from "../../components/MachineBar";
import Table from "../../components/Table";
import { useParams } from "react-router-dom";

const MachineTable = () => {
  const { status } = useParams();
  const [typeId, setTypeId] = useState(0);

  return (
    <>
      <MachineBar setTypeId={setTypeId} />
      <Table endpoint={status} type_id={typeId} />
    </>
  );
};

export default MachineTable;
