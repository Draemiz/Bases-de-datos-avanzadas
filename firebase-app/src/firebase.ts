import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD_ZD_K4ueUjQ9zf1OjpTOQKvQzUTPWrI",
  authDomain: "biblioteca-digital-20f1c.firebaseapp.com",
  projectId: "biblioteca-digital-20f1c",
  storageBucket: "biblioteca-digital-20f1c.firebasestorage.app",
  messagingSenderId: "417196676569",
  appId: "1:417196676569:web:1a3133d7eea2ece69635c8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);