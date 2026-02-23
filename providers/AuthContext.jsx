<<<<<<< HEAD
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
=======
"use client";

import {createContext, useContext, useState, useEffect} from "react";
import {auth, rtdb} from "../auth/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {ref, get} from "firebase/database";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = ref(rtdb, `users/${fbUser.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            setUser({uid: fbUser.uid, ...snapshot.val()});
          } else {
            setUser({uid: fbUser.uid});
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({uid: fbUser.uid});
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (user === undefined) {
    return null; // أو Spinner
  }
  return (
    <AuthContext.Provider value={{user, loading}}>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
<<<<<<< HEAD
  if (!context) {
=======
  if (context === undefined) {
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
