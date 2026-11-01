
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase";

// Admin login
export const loginAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Admin logout
export const logoutAdmin = () => {
  return signOut(auth);
};

// Monitor authentication status
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
