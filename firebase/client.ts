import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA2in8FQR2ZjNeaiw4rG--n8RrER8sW6XQ",
  authDomain: "prepwise-a1527.firebaseapp.com",
  projectId: "prepwise-a1527",
  storageBucket: "prepwise-a1527.firebasestorage.app",
  messagingSenderId: "939632738934",
  appId: "1:939632738934:web:602fd0aa20e0e0b3bdd557",
  measurementId: "G-JF448E39B9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);