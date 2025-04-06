import styles from "../style/Footer.module.css";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const Footer = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await fetch("/auth/logout");
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    }
    alert(data.message);
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <footer>
      <p>bluTape/</p>
      <div>
        <p>Matt's Appliances, LLC</p>
        <div className={styles.directions}>
          {user && user.is_admin && <Link to="/register">Register</Link>}
          {user && <Link onClick={logout}>Logout</Link>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
