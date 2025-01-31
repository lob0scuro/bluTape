import styles from "./Footer.module.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../App";

const Footer = () => {
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
      localStorage.removeItem("loggedInUser");
      setUser({});
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <footer className={styles.footer}>
      {loggedIn && (
        <div>
          <Link to="/login-page" onClick={() => logout()}>
            Logout
          </Link>
        </div>
      )}

      <div>
        <p>Matt's Appliances, LLC.</p>
      </div>
      <div>
        <p>
          <b>bluTape</b>/ created by: Cameron Lopez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
