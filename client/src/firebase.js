// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-af2d4.firebaseapp.com",
  projectId: "mern-blog-af2d4",
  storageBucket: "mern-blog-af2d4.appspot.com",
  messagingSenderId: "664898410654",
  appId: "1:664898410654:web:db1d6e626a7258c8e2838f",
  authorizedDomains: ["https://your-redirect-url.com"],
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
