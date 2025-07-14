// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "mindfulconnect-d1b00.firebaseapp.com",
  projectId: "mindfulconnect-d1b00",
  storageBucket: "mindfulconnect-d1b00.firebasestorage.app",
  messagingSenderId: "1073229312544",
  appId: "1:1073229312544:web:d0090db9f57796f68a0245",
  measurementId: "G-29JKH73M99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);