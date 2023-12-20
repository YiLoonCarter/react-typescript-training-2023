// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz27b2el4wM_sPqUbvoAaTs-2k9PO37c4",
  authDomain: "react-course-92f16.firebaseapp.com",
  projectId: "react-course-92f16",
  storageBucket: "react-course-92f16.appspot.com",
  messagingSenderId: "474852833727",
  appId: "1:474852833727:web:bebb036feafaf9a0ae090a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);