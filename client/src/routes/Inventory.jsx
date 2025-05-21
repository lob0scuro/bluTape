import { useEffect, useState } from "react";
import { fetchInventory } from "../utils";
import toast from "react-hot-toast";
import Table from "../components/Table";

const Inventory = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const gittem = async () => {
      const gottem = await fetchInventory();
      if (!gottem.success) {
        toast.error(gottem.error);
        setMachines([]);
      }
      setMachines(gottem.machines);
    };
    gittem();
  }, []);

  return (
    <div>
      <h1>Inventory Batch</h1>
      <Table machines={machines} />
    </div>
  );
};

export default Inventory;
