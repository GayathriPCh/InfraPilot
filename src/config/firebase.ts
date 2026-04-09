import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXs25-GNWb2dx3LowcDi5CLe4YXQr3-zs",
  authDomain: "ovps-2c71b.firebaseapp.com",
  projectId: "ovps-2c71b",
  storageBucket: "ovps-2c71b.firebasestorage.app",
  messagingSenderId: "585114211388",
  appId: "1:585114211388:web:98972c7185278a04d15f39",
  measurementId: "G-T2DDT4PKDS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage (for file uploads)
export const storage = getStorage(app);

export default app;
