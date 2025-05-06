import styles from "../style/Navbar.module.css";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>bluTape/{user && <small>{user.first_name}</small>}</h1>
      </Link>
      <FontAwesomeIcon
        icon={faBars}
        className={styles.hamburger}
        style={navOpen ? { color: "#8999af" } : { color: "inherit" }}
        onClick={() => setNavOpen(!navOpen)}
        onBlur={() => setNavOpen(!navOpen)}
      />
      <nav>
        {user && (
          <>
            {navOpen && (
              <div className={styles.navLinks}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/start">Start</NavLink>
                <NavLink to="/active">Active</NavLink>
                <NavLink to="/finished">Finished</NavLink>
              </div>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
