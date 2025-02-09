import styles from "./Footer.module.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const Footer = () => {
  const { user, logout } = useAuth();

  return (
    <footer className={styles.footer}>
      {user && (
        <div className={styles.logoutLink}>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}

      <div className={styles.footerTextBlock}>
        <p>Matt's Appliances, LLC.</p>
        <p>
          <b>bluTape</b>/ created by: Cameron Lopez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
