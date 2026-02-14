// ./providers/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({
  user: null, // default value
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
