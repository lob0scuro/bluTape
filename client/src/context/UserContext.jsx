import { useContext, createContext, useState, useEffect } from "react";

const authContext = createContext();

export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/auth/refresh_user", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error("User not authenticated");
        }
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`/auth/login/${credentials.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUser(data.user);
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/auth/logout");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUser(null);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <authContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
