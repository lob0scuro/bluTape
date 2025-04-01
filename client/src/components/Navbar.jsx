import styles from "../style/Navbar.module.css";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>bluTape/</h1>
      </Link>
      <nav>
        <NavLink>Home</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
