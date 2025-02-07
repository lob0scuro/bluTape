import styles from "./Navbar.module.css";
import React, { useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/UserContext";
const Navbar = () => {
  const { user } = useAuth();

  return (
    <header>
      <h1 className={styles.navbarHeader}>
        <Link to="/">
          bluTape<small>/</small>
          <span>{user ? user.first_name : null}</span>
        </Link>
      </h1>

      {user && (
        <nav>
          <NavLink to="/start-repair">Start Repair</NavLink>
          <NavLink to="/active-repairs">Active</NavLink>
          <NavLink to="/inventory-list">Completed</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
