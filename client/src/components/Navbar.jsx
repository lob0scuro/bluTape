import styles from "../style/Navbar.module.css";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>bluTape/{user && <small>{user.first_name}</small>}</h1>
      </Link>
      <nav>
        {user && (
          <div className={styles.navLinks}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/start">Start</NavLink>
            <NavLink to="/active">Active</NavLink>
            <NavLink to="/finished">Finished</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
