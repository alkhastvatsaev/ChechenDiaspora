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

// Check if we are in a browser or have a valid config to avoid build errors
const isBrowser = typeof window !== "undefined";
const hasValidConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

// Initialize App (Singleton pattern)
const app = !getApps().length 
  ? initializeApp(hasValidConfig ? firebaseConfig : { ...firebaseConfig, apiKey: "placeholder", projectId: "placeholder" }) 
  : getApp();

// Initialize services only if we have a valid config to avoid crashing the build
export const auth = hasValidConfig ? getAuth(app) : ({} as any);
export const db = hasValidConfig ? getDatabase(app) : ({} as any);

// Firestore fix for Vercel
export const firestore = hasValidConfig 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }) 
  : ({} as any);
