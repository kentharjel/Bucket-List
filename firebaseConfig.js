// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADg2ZZ1-wcsFQdsycTca0XRsG8N71Jcks",
  authDomain: "bucket-list-22a5c.firebaseapp.com",
  projectId: "bucket-list-22a5c",
  storageBucket: "bucket-list-22a5c.firebasestorage.app",
  messagingSenderId: "644992241041",
  appId: "1:644992241041:web:15d795607361ea26ffde30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)