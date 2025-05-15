import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch current user on mount if exists (back-end session based)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/auth/current_user", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error("User not authenticated!");
        }
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
