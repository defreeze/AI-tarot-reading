// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import for Firebase Authentication

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_HEeKTYjx6uxSXMjcx1js12bsA4_hYYk",
    authDomain: "ai-tarot-v1.firebaseapp.com",
    projectId: "ai-tarot-v1",
    storageBucket: "ai-tarot-v1.appspot.com",
    messagingSenderId: "955445276837",
    appId: "1:955445276837:web:e77445d1f46cc3d7c75d4c",
    measurementId: "G-V77EC5FG92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export it
const auth = getAuth(app);
export { auth, app, analytics };

