
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyC05RRDlDjq_Y2tWJZM6EekjWP-Ja-jb1U",
    authDomain: "olamangy-e1326.firebaseapp.com",
    projectId: "olamangy-e1326",
    storageBucket: "olamangy-e1326.firebasestorage.app",
    messagingSenderId: "250523675876",
    appId: "1:250523675876:web:093ca5e79da104ac3a10f1",
    measurementId: "G-6JQPTNRW5Q",
    databaseURL:"https://olamangy-e1326-default-rtdb.europe-west1.firebasedatabase.app"
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const rtdb = getDatabase(app); 
export const googleProvider = new GoogleAuthProvider();

export default app;