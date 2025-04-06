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
        {user ? (
          <NavLink to="/">Home</NavLink>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
