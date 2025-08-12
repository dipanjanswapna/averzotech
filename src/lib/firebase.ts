
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4q4m8pNjCB8ihd5jsU6AvgjZMp22WBAg",
  authDomain: "averzo-marketplace.firebaseapp.com",
  projectId: "averzo-marketplace",
  storageBucket: "averzo-marketplace.firebasestorage.app",
  messagingSenderId: "237952506110",
  appId: "1:237952506110:web:40ae8d76143c40523cadaf",
  measurementId: "G-NVTRQ7EB2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
