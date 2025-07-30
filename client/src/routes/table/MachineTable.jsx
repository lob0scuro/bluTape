import { useEffect, useState } from "react";
import MachineBar from "../../components/MachineBar";
import Table from "../../components/Table";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { exportTable } from "../../utils/API";
import toast from "react-hot-toast";

const MachineTable = () => {
  const { status } = useParams();
  const [typeId, setTypeId] = useState(0);
  const navigate = useNavigate();

  const exported = async () => {
    const response = await exportTable();
    if (!response.success) {
      toast.error(response.error);
      return;
    }
    toast.success(response.message);
    navigate("/");
  };

  return (
    <>
      <MachineBar setTypeId={setTypeId} />
      <Table endpoint={status} type_id={typeId} />
      {status === "inventory" && (
        <Button title={"Export Table"} onClick={exported} />
      )}
    </>
  );
};

export default MachineTable;
