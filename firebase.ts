// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBh97GE3ZLnqjaXsoWQMoJRBIB71xiqe0",
  authDomain: "food-dictation-app.firebaseapp.com",
  projectId: "food-dictation-app",
  storageBucket: "food-dictation-app.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "231421284231",
  appId: "1:231421284231:web:4635f8a831c631fa6f8d22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;
export { auth };
