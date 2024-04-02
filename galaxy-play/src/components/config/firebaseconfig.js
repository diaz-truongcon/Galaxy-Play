// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBicwcbEznYBKoyc9TqGVsi1sTjXw5Dx-k",
  authDomain: "galaxy-play-f81cf.firebaseapp.com",
  projectId: "galaxy-play-f81cf",
  storageBucket: "galaxy-play-f81cf.appspot.com",
  messagingSenderId: "268222403252",
  appId: "1:268222403252:web:c2e1a3df705e2273a7bde1",
  measurementId: "G-92LXH0CERK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);