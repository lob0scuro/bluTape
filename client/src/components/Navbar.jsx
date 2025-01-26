import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../App";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [loggedIn, setLoggedIn, user, setUser] = useContext(LoginContext);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.message);
      setLoggedIn(false);
      setUser({});
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <header>
      <h1 className={styles.navbarHeader}>
        <Link to="/">
          bluTape<small>/</small>
          <span>{user ? user.first_name : null}</span>
        </Link>
      </h1>
      <nav>
        {loggedIn ? (
          <Link to="/login-page" onClick={logout}>
            Logout
          </Link>
        ) : (
          <Link to="/login-page">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
