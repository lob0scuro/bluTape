import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">bluTape/{user && <span>{user.first_name}</span>}</Link>
      </h1>
      {user && !open && (
        <FontAwesomeIcon
          icon={faBars}
          className={styles.menuBar}
          onClick={() => setOpen(true)}
        />
      )}
      {user && open && (
        <nav>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.closeMenu}
            onClick={() => setOpen(false)}
          />
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          {["Technician", "Office"].includes(user.position) && (
            <NavLink to="/add" onClick={() => setOpen(false)}>
              Wrap-Up{" "}
            </NavLink>
          )}
          {/* <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSCvrr6XOeZ4rUCAl5t2sQDyuMINIFxVcVxWA7xb5hNrJtoUQZidzqEjg2PNE1UoqxSk7x-Fsj6yDpa/pubhtml?gid=122600756&single=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Schedule
          </a> */}
          <h4>Tables</h4>
          <NavLink
            className={styles.adminNavLinks}
            to="/table/queued"
            onClick={() => setOpen(false)}
          >
            <small>Queue</small>
          </NavLink>
          {(user.is_admin ||
            ["Office", "Service", "Sales"].includes(user.position)) && (
            <>
              {/* <NavLink
                className={styles.adminNavLinks}
                to="/table/cleaned"
                onClick={() => setOpen(false)}
              >
                <small>Cleaned</small>
              </NavLink> */}
              <NavLink
                className={styles.adminNavLinks}
                to="/table/export"
                onClick={() => setOpen(false)}
              >
                <small>Inventoried</small>
              </NavLink>
            </>
          )}
          {user.is_admin && (
            <>
              <h4>Admin</h4>
              <NavLink
                className={styles.adminNavLinks}
                to="/admin-panel"
                onClick={() => setOpen(false)}
              >
                <small>Admin Panel</small>
              </NavLink>
              <NavLink
                className={styles.adminNavLinks}
                to="/register"
                onClick={() => setOpen(false)}
              >
                <small>Register New User</small>
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
