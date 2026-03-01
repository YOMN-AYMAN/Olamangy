"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/auth/firebase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const subjectsRef = ref(rtdb, 'subjects');
                const subSnap = await get(subjectsRef);
                if (subSnap.exists()) {
                    const data = subSnap.val();
                    const subArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setSubjects(subArray);
                }

                const plansRef = ref(rtdb, 'plans');
                const planSnap = await get(plansRef);
                if (planSnap.exists()) {
                    const data = planSnap.val();
                    const planArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setPlans(planArray);
                }
            } catch (error) {
                console.error("Error fetching app data:", error);
            }
        };
        fetchGlobalData();
    }, []);

    return (
        <AppContext.Provider value={{ subjects, plans }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);