import styles from "../style/Navbar.module.css";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    const response = await fetch("/auth/logout");
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error);
      return data.error;
    }
    toast.success(data.message);
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <Link to="/" onClick={() => setNavOpen(false)}>
        <h1>bluTape/{user && <small>{user.first_name}</small>}</h1>
      </Link>

      {user && (
        <FontAwesomeIcon
          icon={faBars}
          className={styles.hamburger}
          style={navOpen ? { color: "#8999af" } : { color: "inherit" }}
          onClick={() => setNavOpen(!navOpen)}
        />
      )}
      <nav>
        {user && navOpen && (
          <div className={styles.navLinks}>
            <NavLink onClick={() => setNavOpen(false)} to="/">
              Home
            </NavLink>
            <NavLink onClick={() => setNavOpen(false)} to="/start">
              Start
            </NavLink>
            <NavLink onClick={() => setNavOpen(false)} to="/active">
              Active
            </NavLink>
            <NavLink onClick={() => setNavOpen(false)} to="/finished">
              Finished
            </NavLink>
          </div>
        )}
        {user && (
          <div className={styles.lgScreenLinks}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/start">Start</NavLink>
            <NavLink to="/active">Active</NavLink>
            <NavLink to="/finished">Finished</NavLink>
          </div>
        )}
      </nav>
      <div className={styles.lgScreenFooter}>
        <div>{user && <Link onClick={logout}>Logout</Link>}</div>
        <div>
          <p>bluTape/</p>
          <p>Matt's Appliances, LLC</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
