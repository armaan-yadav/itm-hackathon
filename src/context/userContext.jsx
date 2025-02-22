import authServices from "@/services/authServices";
import { createContext, useState, useEffect } from "react";

const initialValue = {
  user: null,
  addUser: () => {},
  removeUser: () => {},
};

export const userContext = createContext(initialValue);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const addUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUser = async () => {
    await authServices.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <userContext.Provider value={{ user, addUser, removeUser }}>
      {children}
    </userContext.Provider>
  );
};
