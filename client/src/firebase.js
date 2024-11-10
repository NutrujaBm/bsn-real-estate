// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bsn-real-estate.firebaseapp.com",
  projectId: "bsn-real-estate",
  storageBucket: "bsn-real-estate.firebasestorage.app",
  messagingSenderId: "568602382853",
  appId: "1:568602382853:web:1f335b9656ce7bb4b3c26c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
