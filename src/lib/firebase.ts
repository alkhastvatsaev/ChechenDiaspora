import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const hasValidConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!hasValidConfig && typeof window !== 'undefined') {
  console.warn("⚠️ Firebase configuration missing! App is running in placeholder mode. Please check Vercel environment variables.");
}

const app: FirebaseApp = !getApps().length 
  ? initializeApp(hasValidConfig ? firebaseConfig : {
      apiKey: "placeholder",
      authDomain: "placeholder",
      projectId: "placeholder",
      storageBucket: "placeholder",
      messagingSenderId: "placeholder",
      appId: "placeholder",
      databaseURL: "https://placeholder-default-rtdb.firebaseio.com"
    })
  : getApp();

const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);
const firestore: Firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, firestore, storage, hasValidConfig };
