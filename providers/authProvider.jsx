"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, rtdb } from "@/auth/firebase"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const userRef = ref(rtdb, `users/${fbUser.uid}`);
                const snapshot = await get(userRef);
                
                if (snapshot.exists()) {
                    setUser({ uid: fbUser.uid, ...snapshot.val() });
                } else {
                    setUser({ uid: fbUser.uid }); 
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);