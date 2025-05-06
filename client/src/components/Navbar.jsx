import styles from "../style/Navbar.module.css";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      <Link to="/" onClick={() => setNavOpen(false)}>
        <h1>bluTape/{user && <small>{user.first_name}</small>}</h1>
      </Link>
      <FontAwesomeIcon
        icon={faBars}
        className={styles.hamburger}
        style={navOpen ? { color: "#8999af" } : { color: "inherit" }}
        onClick={() => setNavOpen(!navOpen)}
      />
      <nav>
        {user && (
          <>
            {navOpen && (
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
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
