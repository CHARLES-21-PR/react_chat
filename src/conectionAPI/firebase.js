import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "reactchat-22682",
  "appId": "1:154211793992:web:ee5671c24bab29fe4bac7d",
  "storageBucket": "reactchat-22682.firebasestorage.app",
  "apiKey": "AIzaSyD3NvuOeYN1clRGlBccEqXSfYZBk-N66Uk",
  "authDomain": "reactchat-22682.firebaseapp.com",
  "messagingSenderId": "154211793992",
  "measurementId": "G-6HVHC1YN3B",
  "projectNumber": "154211793992",
  "version": "2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);