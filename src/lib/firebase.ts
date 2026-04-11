import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
let storage: any;

const hasValidConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!hasValidConfig && typeof window !== 'undefined') {
  console.warn("⚠️ Firebase configuration missing! App is running in placeholder mode. Please check Vercel environment variables.");
}

if (!getApps().length) {
  app = initializeApp(hasValidConfig ? firebaseConfig : {
    apiKey: "placeholder",
    authDomain: "placeholder",
    projectId: "placeholder",
    storageBucket: "placeholder",
    messagingSenderId: "placeholder",
    appId: "placeholder",
    databaseURL: "https://placeholder-default-rtdb.firebaseio.com"
  });
} else {
  app = getApp();
}

auth = getAuth(app);
db = getDatabase(app);
firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
storage = getStorage(app);

export { app, auth, db, firestore, storage, hasValidConfig };
