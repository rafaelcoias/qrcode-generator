import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "qrcode-2d7d7.firebaseapp.com",
  projectId: "qrcode-2d7d7",
  storageBucket: "qrcode-2d7d7.appspot.com",
  messagingSenderId: "694620086833",
  appId: "1:694620086833:web:04d97401f39773898eab10",
  measurementId: "G-V0VJR57R8Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);