import styles from "./Navbar.module.css";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className={styles.header}>
      <h1 className={styles.navbarHeader}>
        <Link to="/">
          bluTape<small>/</small>
          <span>{user ? user.first_name : null}</span>
        </Link>
      </h1>

      {user && !isHome && (
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
