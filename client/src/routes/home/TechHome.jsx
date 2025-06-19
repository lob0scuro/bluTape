import styles from "./Home.Module.css";
import { useAuth } from "../../context/UserContext";
import { currentDay } from "../../utils/Tools";
import { fetchUserWrapUps } from "../../utils/API";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TaskBox from "../../components/TaskBox";

const TechHome = () => {
  const { user } = useAuth();
  const [wrapUps, setWrapUps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getWrapUps = async () => {
      const gotWrapUps = await fetchUserWrapUps(user.id);
      if (!gotWrapUps.success) {
        toast.error(gotWrapUps.error);
        setWrapUps([]);
      }
      setWrapUps(gotWrapUps.machines);
    };
    getWrapUps();
  }, []);

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div className={styles.homeBlock}>
      <p className={styles.date}>{currentDay()}</p>
      <div className={styles.activityBlock}>
        <h3>Recent Activity:</h3>
        <ul className={styles.activityList}>
          {wrapUps?.map(({ id, brand, model }) => (
            <li key={id} onClick={() => navigate(`/card/${id}`)}>
              {brand} - <small>{model}</small>
            </li>
          ))}
          {wrapUps.length === 0 && <p>--No recent machines--</p>}
        </ul>
      </div>
      <div className={styles.taskBlock}>
        <TaskBox id={user.id} />
      </div>
    </div>
  );
};

export default TechHome;
