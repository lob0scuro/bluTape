import styles from "../style/Footer.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <p>bluTape/</p>
      <div>
        <p>Matt's Appliances, LLC</p>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  );
};

export default Footer;
