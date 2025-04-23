import styles from "../style/Home.module.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <div className={styles.homeScreenButtonGroup}>
        <Link to="/start">Start Repair</Link>
        <Link to="/active">Active Repairs</Link>
        <Link to="/finished">Finished Repairs</Link>
      </div>
    </>
  );
};

export default Home;
