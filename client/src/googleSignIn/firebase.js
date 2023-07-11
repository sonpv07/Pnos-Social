// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlptxA_eOhWxpNwPSlCxXg7-M-g3KPXqc",
  authDomain: "pnos-social.firebaseapp.com",
  projectId: "pnos-social",
  storageBucket: "pnos-social.appspot.com",
  messagingSenderId: "926564767525",
  appId: "1:926564767525:web:5595a569724d147881accc",
  measurementId: "G-G2P3L0CPYH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
