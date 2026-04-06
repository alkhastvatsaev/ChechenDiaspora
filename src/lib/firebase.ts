import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

// Safety check for Project ID to avoid FATAL errors during build
const hasValidConfig = !!firebaseConfig.projectId;

// Initialize App (Singleton pattern for Next.js Fast Refresh)
const app = !getApps().length 
  ? initializeApp(hasValidConfig ? firebaseConfig : { ...firebaseConfig, projectId: "placeholder-id" }) 
  : getApp();

// Only initialize services if we have a valid config, or return them as potentially null-initialized
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const db = getDatabase(app);
export const auth = getAuth(app);
