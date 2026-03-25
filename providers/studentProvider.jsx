"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {ref, onValue} from "firebase/database";
import {rtdb} from "@/auth/firebase";
import {useAuth} from "./AuthContext.jsx";

const StudentContext = createContext();

export const StudentProvider = ({children}) => {
  const {user} = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [teachers, setTeachers] = useState([])
  useEffect(() => {
    if (user && user.role === "student") {
      const userRef = ref(rtdb, `users/${user.uid}`);

      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setStudentProfile(data);

          // Extracts subscriptions
          if (data.subscriptions) {
            const subsArray = Object.keys(data.subscriptions).map(key => ({
              id: key,
              ...data.subscriptions[key]
            }));
            setSubscriptions(subsArray);
          } else {
            setSubscriptions([]);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [user]);
  useEffect(() => {
    const teachersRef = ref(rtdb, "teachers");
    const unsubscribe = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([id, val]) => ({
            id,
            ...val
        }));
        setTeachers(arr.filter(t => t.status === "approved"))
      } else {
        setTeachers([]);
      }
    });
    return () => unsubscribe();
  }, [])
  return (
    <StudentContext.Provider value={{teachers, studentProfile, subscriptions}}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
