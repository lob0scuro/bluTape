import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../App";
const Home = () => {
  const [user, setUser] = useContext(LoginContext);
  return (
    <>
      <div className="buttonBlock">
        <Link to="/start-repair">Start Repair</Link>
        <Link to="/active-repairs">Active Repairs</Link>
        <Link to="/inventory-list">Finished Repairs</Link>
      </div>
    </>
  );
};

export default Home;
