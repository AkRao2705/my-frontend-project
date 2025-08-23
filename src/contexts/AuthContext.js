import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    console.log("Logging in with token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    console.log("Checking if admin. User:", user, "Role:", user?.role);
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
