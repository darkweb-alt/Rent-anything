import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1h_VgT94D_y3CSZTSQwxhT9r-zgtgjQE",
  authDomain: "rent-anything-59507.firebaseapp.com",
  projectId: "rent-anything-59507",
  storageBucket: "rent-anything-59507.firebasestorage.app",
  messagingSenderId: "800147116529",
  appId: "1:800147116529:web:897026c63ed96aa5097450",
  measurementId: "G-8L7MGDTYR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
