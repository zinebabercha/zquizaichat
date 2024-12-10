// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7DZylZtTwbsWyY6QvaWcEb78pu8fZ9Zk",
  authDomain: "aiclassroom-fda9f.firebaseapp.com",
  projectId: "aiclassroom-fda9f",
  storageBucket: "aiclassroom-fda9f.firebasestorage.app",
  messagingSenderId: "832786794228",
  appId: "1:832786794228:web:33e642c0cab8bcb84f40a1",
  measurementId: "G-9JNX4HTXPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;