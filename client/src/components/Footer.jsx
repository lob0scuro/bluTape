import styles from "./Footer.module.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Footer = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <footer className={styles.footer}>
      {user && (
        <div className={styles.logoutLink}>
          <Link to="/login-page" onClick={() => logout()}>
            Logout
          </Link>
        </div>
      )}

      <div className={styles.footerTextBlock}>
        <p>
          <small>Matt's Appliances, LLC.</small>
        </p>
        <p>
          <small>2600 Common St. Lake Charles, LA, 70607</small>
        </p>
        <p>
          <b>bluTape</b>/ created by: Cameron Lopez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
