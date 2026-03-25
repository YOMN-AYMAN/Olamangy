"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/auth/firebase";
import { useAuth } from "./AuthContext.jsx";

const DeveloperContext = createContext();

export const DeveloperProvider = ({ children }) => {
    const { user } = useAuth();
    const [developerProfile, setDeveloperProfile] = useState(null);

    useEffect(() => {
        if (user && (user.role === "admin" || user.role === "developer")) {
            const devRef = ref(rtdb, `users/${user.uid}`);
            
            const unsubscribe = onValue(devRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setDeveloperProfile(data);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    return (
        <DeveloperContext.Provider value={{ developerProfile }}>
            {children}
        </DeveloperContext.Provider>
    );
};

export const useDeveloper = () => useContext(DeveloperContext);
