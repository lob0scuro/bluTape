import styles from "../style/Home.module.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { roleMap } from "../utils";
import TaskBox from "../components/TaskBox";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className={styles.homeBlock}>
      <div className={styles.userBlock}>
        <img src={user.profile_pic} alt={user.first_name} />
        <div className={styles.userBlockInfo}>
          <p className={styles.userBlockRole}>
            {roleMap[user.role]} Tech {user.is_admin && <span>Admin</span>}
          </p>
          <p className={styles.userBlockName}>{user.full_name}</p>
          <p style={{ fontStyle: "italic" }}>{user.email}</p>
        </div>
      </div>
      {user.is_admin && (
        <div className={styles.adminPanelButtonBlock}>
          <Link to="/edit_tech">View Techs</Link>
          <Link to="/register">Register</Link>
          <Link>Exported</Link>
        </div>
      )}
      <TaskBox />
    </div>
  );
};

export default Home;
