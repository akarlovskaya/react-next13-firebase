import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import {
  doc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { googleAuthProvider } from "../lib/firebase";

/**
 * Completely delete a user's account and all associated data
 */
const DeleteUserAccount = async (password = null) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  if (!user) {
    throw new Error("No authenticated user found");
  }

  const isGoogleUser = user.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  if (!isGoogleUser && !password) {
    throw new Error("Password is required for account deletion");
  }

  try {
    // 1. Re-authenticate based on provider
    await reauthenticateUser(user, password, isGoogleUser);

    // // 2. Delete all Firestore data in a batch
    await deleteUserData(db, user.uid);

    // // 3. Delete the Auth account
    await deleteUser(user);

    // // 4. Clear local storage
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return handleDeletionError(error);
  }
};

// Helper function to reauthenticate user based on auth provider
const reauthenticateUser = async (user, password, isGoogleUser) => {
  console.log("user prop from reauthenticateUser", user);

  if (isGoogleUser) {
    try {
      await reauthenticateWithPopup(user, googleAuthProvider);
    } catch (error) {
      console.error("Google Reauthentication error:", error);

      // Handle specific popup-related errors
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Reauthentication cancelled by user");
      }

      throw error;
    }
  } else {
    const email = user.email;
    const credential = EmailAuthProvider.credential(email, password);
    try {
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error("Email Reauthentication error:", error);
      throw error;
    }
  }
};

// Helper function to delete user data from Firestore
const deleteUserData = async (db, userId) => {
  // Create a batch for all Firestore operations
  const batch = writeBatch(db);

  // 1. Get and delete all user's workouts
  const workoutsRef = collection(db, "users", userId, "workouts");
  const workoutsQuery = query(workoutsRef, where("uid", "==", userId));
  const workoutsSnapshot = await getDocs(workoutsQuery);
  // Add workout deletions to batch
  workoutsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 2. Get and delete user's username entry
  const usernameRef = collection(db, "usernames");
  const usernameQuery = query(usernameRef, where("uid", "==", userId));
  const usernameSnapshot = await getDocs(usernameQuery);
  // Add username deletion to batch
  usernameSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 3. Delete user document
  const userRef = doc(db, "users", userId);
  batch.delete(userRef);

  // To DO: Delete reservations (if they're a participant)
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
};

// Helper function to handle deletion errors with appropriate messages
const handleDeletionError = (error) => {
  const errorMap = {
    "auth/wrong-password": {
      success: false,
      error: "Incorrect password. Please try again.",
    },
    "auth/missing-password": {
      success: false,
      error: "Password is required to delete your account.",
    },
    "auth/requires-recent-login": {
      success: false,
      error:
        "For security reasons, please re-enter your password to delete your account.",
      requiresReauthentication: true,
    },
    "auth/too-many-requests": {
      success: false,
      error: "Too many requests. Please try again in 5-15 minutes.",
      requiresReauthentication: true,
    },
    "auth/invalid-credential": {
      success: false,
      error: "Invalid Credential",
      requiresReauthentication: true,
    },
  };

  return errorMap[error.code] || { success: false, error: error.message };
};

export default DeleteUserAccount;
