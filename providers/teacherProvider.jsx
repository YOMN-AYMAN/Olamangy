"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { rtdb } from "@/auth/firebase";
import { useAuth } from "./AuthContext.jsx";

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
    const { user } = useAuth();
    const [teacherProfile, setTeacherProfile] = useState(null);

    useEffect(() => {
        if (user && user.role === "teacher") {
            const teachersRef = ref(rtdb, 'teachers');
            const teacherQuery = query(teachersRef, orderByChild('userId'), equalTo(user.uid));
            
            const unsubscribe = onValue(teacherQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const key = Object.keys(data)[0]; 
                    setTeacherProfile({ id: key, ...data[key] });
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    return (
        <TeacherContext.Provider value={{ teacherProfile }}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeacher = () => useContext(TeacherContext);