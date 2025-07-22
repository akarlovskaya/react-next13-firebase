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
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
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

// Turn on emulator and Initialize only once
let functions;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);

  // Firestore setup
  firestore = getFirestore(app);
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(firestore, "localhost", 8080);
      console.log("Firestore emulator connected");
    } catch (e) {
      console.warn("Firestore emulator connection failed", e);
    }
  }

  // Functions setup (for Trigger Email)
  functions = getFunctions(app);
  if (process.env.NODE_ENV === "development") {
    try {
      connectFunctionsEmulator(functions, "localhost", 5001);
      console.log("Functions emulator connected");
    } catch (e) {
      console.warn("Functions emulator connection failed", e);
    }
  }
}

export { functions };

// GetUserWithUsername function gets user data and returns a plain object
export async function getUserWithUsername(username) {
  try {
    // console.log(
    //   `${
    //     typeof window === "undefined" ? "Server" : "Client"
    //   } Searching for username:`,
    //   username
    // );

    const q = query(
      collection(firestore, "users"),
      where("username", "==", username),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    // console.log(
    //   `${
    //     typeof window === "undefined" ? "Server" : "Client"
    //   } Query for username:`,
    //   username,
    //   "returned size:",
    //   querySnapshot.size
    // );

    if (querySnapshot.empty) {
      console.log(
        `${
          typeof window === "undefined" ? "Server" : "Client"
        } No matching user found for username:`,
        username
      );
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    // console.log(
    //   `${typeof window === "undefined" ? "Server" : "Client"} Found user:`,
    //   userDoc.id
    // );

    // Convert to plain object for Server Components
    return userToJSON(userDoc);
    // If later I decide to have ref from fb in object - use this:
    // return {
    //     ...userToJSON(userDoc),
    //     // Include the reference path
    //     userDocPath: userDoc.ref.path
    //   };
  } catch (error) {
    console.error(
      `${
        typeof window === "undefined" ? "Server" : "Client"
      } Error fetching user:`,
      error
    );

    // For Firebase-specific errors
    if (error.code === "permission-denied") {
      throw new Error("You do not have permission to view this profile");
    }

    if (error.code === "unavailable") {
      throw new Error(
        "Service temporarily unavailable. Please try again later"
      );
    }

    // A generic error
    throw new Error("Unable to load user profile");
  }
}

/**
 * Converts a firestore document to JSON
 * Firestore document objects contain methods and non-serializable properties (like Timestamps with their internal representation).
 * When data is passed from a Server Component to a Client Component in Next.js,
 * it needs to be serialized (typically to JSON) to cross the server/client boundary.
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Safely check and convert Firestore timestamps if they exist
    createdAt:
      data?.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
    updatedAt:
      data?.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0,
  };
}

export function userToJSON(userDoc) {
  const data = userDoc.data();
  const userId = userDoc.id;

  return {
    uid: userId,
    ...data,
    // Convert Firestore Timestamp to milliseconds
    createdAt:
      data?.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
  };
}
