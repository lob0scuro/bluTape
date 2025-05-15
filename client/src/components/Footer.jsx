import styles from "../style/Footer.module.css";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import toast from "react-hot-toast";

const Footer = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await fetch("/auth/logout");
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    }
    toast.success(data.message);
    // localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <footer>
      <div>
        <p>bluTape/</p>
        <p>Matt's Appliances, LLC</p>
      </div>
      <div className={styles.directions}>
        {user && <Link onClick={logout}>Logout</Link>}
      </div>
    </footer>
  );
};

export default Footer;
