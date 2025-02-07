import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const from = location.state?.from || "/";

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (id) => {
    try {
      fetch(`/api/login/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUser(data.tech);
          localStorage.setItem("loggedInUser", JSON.stringify(data.tech));
          console.log(data.message);
          // navigate(from);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      throw new Error("An error occured: ", error);
    }
  };

  const logout = () => {
    try {
      fetch("/api/logout")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUser(null);
          localStorage.removeItem("loggedInUser");
          console.log(data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      throw new Error("an error occured", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
