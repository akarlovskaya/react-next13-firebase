// utils/user-management.js
import {
  getAuth,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * Completely delete a user's account and all associated data
 */
export const deleteUserAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  if (!user) {
    throw new Error("No authenticated user found");
  }

  try {
    // 1. Delete user data from Firestore
    const batch = writeBatch(db);

    // Delete user document
    const userRef = doc(db, "users", user.uid);
    batch.delete(userRef);

    // Delete workouts (if they're an instructor)
    const workoutsQuery = query(
      collection(db, "workouts"),
      where("uid", "==", user.uid)
    );
    const workoutsSnapshot = await getDocs(workoutsQuery);

    workoutsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete reservations (if they're a participant)
    // const reservationsQuery = query(
    //   collection(db, "reservations"),
    //   where("participantId", "==", user.uid)
    // );
    // const reservationsSnapshot = await getDocs(reservationsQuery);

    // reservationsSnapshot.forEach((doc) => {
    //   batch.delete(doc.ref);
    // });

    // Commit all Firestore deletions
    await batch.commit();

    // 2. Delete the Auth account
    await deleteUser(user);

    // 3. Clear local storage
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with verification of user profile existence
 */
export const signInWithVerification = async (email, password) => {
  const auth = getAuth();

  try {
    // 1. Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 2. Verify the user has data in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists() || !userDoc.data().username) {
      // User exists in Auth but not in Firestore
      await signOut(auth);
      throw new Error("account-incomplete");
    }

    return {
      success: true,
      user: {
        ...user,
        ...userDoc.data(),
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    // Custom handling of our profile verification error
    if (error.message === "account-incomplete") {
      return {
        success: false,
        error: "Your account is incomplete. Please sign up again.",
      };
    }

    return {
      success: false,
      error: error.code,
    };
  }
};
