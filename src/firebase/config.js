
// function Firebase configuration and initialization
import { initializeApp } from "firebase/app";
// getAuth to handle {login ,logout, currentUser, email/password auth}
import { getAuth } from "firebase/auth";
// getFirestore to access {users, orders, addresses, profile data}
import { getFirestore } from "firebase/firestore";


// getStorage to access {images, avatars, files}
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// run Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//use login Firebase authentication service
export const auth = getAuth(app);
//use Firestore database to store and retrieve data
export const db = getFirestore(app);
//use Firebase storage to handle file uploads and downloads
export const storage = getStorage(app);