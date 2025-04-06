import styles from "../style/Home.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className={styles.homeScreenButtonGroup}>
        <Link to="/start">Start Repair</Link>
        <Link to="/active">Active Repairs</Link>
      </div>
    </>
  );
};

export default Home;
