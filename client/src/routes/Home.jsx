import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="buttonBlock">
        <Link to="/start-repair">Start Repair</Link>
        <Link to="/active-repairs">Active Repairs</Link>
        <Link to="/inventory-list">Finished Repairs</Link>
        <Link to="/archives">View Archives</Link>
      </div>
    </>
  );
};

export default Home;
