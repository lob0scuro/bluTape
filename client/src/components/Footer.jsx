import styles from "./Footer.module.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const Footer = () => {
  const { user, logout } = useAuth();

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
          <b>bluTape</b>/ created by: Cameron Lopez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
