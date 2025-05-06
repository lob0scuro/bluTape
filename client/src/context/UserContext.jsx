import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
