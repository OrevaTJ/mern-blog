// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-blog-d5526.firebaseapp.com",
  projectId: "react-blog-d5526",
  storageBucket: "react-blog-d5526.appspot.com",
  messagingSenderId: "1035488087341",
  appId: "1:1035488087341:web:f8bc39101edb2ca8f1d7a4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);