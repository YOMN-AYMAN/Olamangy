
"use client";

import {createContext, useContext, useState, useEffect} from "react";
import {auth, rtdb} from "../auth/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {ref, get, onValue} from "firebase/database";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const userRef = ref(rtdb, `users/${fbUser.uid}`);
        return onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser({ uid: fbUser.uid, ...snapshot.val() });
          } else {
            setUser({ uid: fbUser.uid });
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  if (user === undefined) {
    return null; // أو Spinner
  }
  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
