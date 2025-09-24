import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Header = () => {
  const { user, setUser } = useAuth();
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  const logout = async () => {
    const response = await fetch("/api/auth/logout");
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message);
    }
    toast.success(data.message);
    setUser(null);
  };

  useEffect(() => {
    setOpenNav(false);
  }, [location]);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  return (
    <header>
      <Link to={"/"}>
        <h1>
          bluTape/
          <small>{user && user.first_name}</small>
        </h1>
      </Link>
      {user && (
        <div className="nav-links" ref={navRef}>
          <FontAwesomeIcon icon={faBars} onClick={() => setOpenNav(!openNav)} />
          <nav className={!openNav ? "openNav" : ""}>
            <Link
              to={"/table"}
              className={location.pathname === "/table" ? "navLinkActive" : ""}
            >
              Machines
            </Link>

            <Link
              to={"/find"}
              className={location.pathname === "/find" ? "navLinkActive" : ""}
            >
              Search
            </Link>
            {user.is_admin && (
              <Link
                to={"/admin-panel"}
                className={
                  location.pathname === "/admin-panel" ? "navLinkActive" : ""
                }
              >
                Admin Panel
              </Link>
            )}
            <Link
              onClick={logout}
              style={{
                color: "darkred",
                fontStyle: "italic",
                fontSize: "1.2rem",
              }}
            >
              Logout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
