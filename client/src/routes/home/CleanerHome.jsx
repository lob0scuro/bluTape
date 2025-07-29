import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { fetchAllMachines } from "../../utils/API";
import toast from "react-hot-toast";
import { currentDay } from "../../utils/Tools";
import { useNavigate } from "react-router-dom";
import TaskBox from "../../components/TaskBox";

const CleanerHome = () => {
  const [machines, setMachines] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const get = async () => {
      const got = await fetchAllMachines("queued", 0);
      if (!got.success) {
        toast.error(got.error);
        setMachines([]);
        return;
      }
      setMachines(got.machines);
    };
    get();
  }, []);

  return (
    <div className={styles.homeBlock}>
      <p className={styles.date}>{currentDay()}</p>
      <div className={styles.activityBlock}>
        <h3>Queue</h3>
        <ul className={styles.activityList}>
          {machines.map(({ id, brand, model }) => (
            <li key={id} onClick={() => navigate(`/card/${id}`)}>
              {brand} - {model}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.taskBlock}>
        <TaskBox />
      </div>
    </div>
  );
};

export default CleanerHome;
