import styles from "./Footer.module.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Footer = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <footer className={styles.footer}>
      {user && (
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
