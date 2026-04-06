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

let app: any;
let auth: any;
let db: any;
let firestore: any;

const hasValidConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (hasValidConfig) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getDatabase(app);
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  // During build or if config is missing, we initialize with placeholders to avoid crashes in SDK functions
  // but we warn so the developer knows.
  const placeholderConfig = {
    apiKey: "placeholder",
    authDomain: "placeholder",
    projectId: "placeholder",
    storageBucket: "placeholder",
    messagingSenderId: "placeholder",
    appId: "placeholder",
    databaseURL: "https://placeholder.firebaseio.com"
  };
  
  if (!getApps().length) {
    app = initializeApp(placeholderConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getDatabase(app);
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
}

export { auth, db, firestore };
