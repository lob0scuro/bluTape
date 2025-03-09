import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="buttonBlock">
        <Link to="/start-repair">Start Repair</Link>
        <Link to="/active-repairs">Active Repairs</Link>
        <Link to="/inventory-list">Finished Repairs</Link>
        {user.is_admin && <Link to="/archives">View Archives</Link>}
      </div>
    </>
  );
};

export default Home;
