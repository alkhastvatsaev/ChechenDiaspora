import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUrrI5KawV_4Yvh1FBjtidWKn7eKz4xnc",
  authDomain: "chechen-diaspora-v12345.firebaseapp.com",
  projectId: "chechen-diaspora-v12345",
  storageBucket: "chechen-diaspora-v12345.firebasestorage.app",
  messagingSenderId: "862785484485",
  appId: "1:862785484485:web:2759735808c36df34422ac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
