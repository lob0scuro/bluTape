import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/check_session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        setUser(data);
      } else {
        localStorage.removeItem("loggedInUser");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (id) => {
    try {
      const response = await fetch(`/api/login/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();
      localStorage.setItem("loggedInUser", JSON.stringify(data.tech));
      setUser(data.tech);
      alert(data.message);
      return data; // Return the data or a success message
    } catch (error) {
      console.error("Error with login:", error);
      throw error; // You can rethrow to handle it in the submit function
    }
  };

  const logout = () => {
    const assurance = confirm("Logout?");
    if (!assurance) {
      return;
    }
    try {
      fetch("/api/logout")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          localStorage.removeItem("loggedInUser");
          setUser(null);
          alert(data.message);
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
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
