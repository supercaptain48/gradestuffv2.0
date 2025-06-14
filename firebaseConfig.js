// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj89O_DJFvqr2LQG5aQOkxO0X2wdiMPXY",
  authDomain: "gradestuffv2.firebaseapp.com",
  projectId: "gradestuffv2",
  storageBucket: "gradestuffv2.firebasestorage.app",
  messagingSenderId: "429664515381",
  appId: "1:429664515381:web:46fbd1c17b8fee4e6a887c",
  measurementId: "G-2HQD3N5XEM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);