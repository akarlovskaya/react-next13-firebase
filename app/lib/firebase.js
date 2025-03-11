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

// Turn on emulator
connectFirestoreEmulator(firestore, "localhost", 8080);
console.log("Firestore instance:", firestore._databaseId.projectId);
if (firestore._settings.host?.includes("localhost")) {
  console.log("Using Firestore Emulator!");
} else {
  console.log("Using Production Firestore!");
}

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
