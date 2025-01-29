import React, { useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { LoginContext } from "../App";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [loggedIn, setLoggedIn, user, setUser] = useContext(LoginContext);

  return (
    <header>
      <h1 className={styles.navbarHeader}>
        <Link to="/">
          bluTape<small>/</small>
          <span>{user ? user.first_name : null}</span>
        </Link>
      </h1>

      {loggedIn && (
        <nav>
          <NavLink to="/start-repair">Start Repair</NavLink>
          <NavLink to="/active-repairs">Active</NavLink>
          <NavLink to="/inventory-list">Inventory</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
