


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwybAGqBtSzdNNtUWJP4_Ku9qG110-sMM",
  authDomain: "infi-flow.firebaseapp.com",
  projectId: "infi-flow",
  storageBucket: "infi-flow.firebasestorage.app",
  messagingSenderId: "219057921975",
  appId: "1:219057921975:web:0c10e530c37c7a0c929232",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
