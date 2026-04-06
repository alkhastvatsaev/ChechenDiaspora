import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUrrI5KawV_4Yvh1FBjtidWKn7eKz4xnc",
  authDomain: "chechen-diaspora-v12345.firebaseapp.com",
  projectId: "chechen-diaspora-v12345",
  storageBucket: "chechen-diaspora-v12345.firebasestorage.app",
  messagingSenderId: "862785484485",
  appId: "1:862785484485:web:2759735808c36df34422ac",
  databaseURL: "https://chechen-diaspora-v12345-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
