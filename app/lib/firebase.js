import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhvWMXucX-rlkpw3dwhw8-OOTJbzqUhX8",
  authDomain: "react-next13-firebase.firebaseapp.com",
  projectId: "react-next13-firebase",
  storageBucket: "react-next13-firebase.firebasestorage.app",
  messagingSenderId: "262133091227",
  appId: "1:262133091227:web:7992df182f66ba84db2f3e",
};

// Initialize Firebase
function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = "state_changed";

/// Helper functions

/**
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  // const usersRef = collection(firestore, 'users');
  // const query = usersRef.where('username', '==', username).limit(1);

  const q = query(
    collection(firestore, "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  // console.log("data from firebase", data);
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    // createdAt: data?.createdAt.toMillis() || 0,
    // updatedAt: data?.updatedAt.toMillis() || 0,

    // Safely check and convert Firestore timestamps if they exist
    createdAt:
      data?.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
    updatedAt:
      data?.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0,
  };
}
