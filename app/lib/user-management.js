import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
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

/**
 * Completely delete a user's account and all associated data
 */
const DeleteUserAccount = async (password) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  if (!user) {
    throw new Error("No authenticated user found");
  }
  if (!password) {
    throw new Error("Password is required for account deletion");
  }

  try {
    // Re-authenticate the user first
    const email = user.email;
    // Create credential with email and provided password
    const credential = EmailAuthProvider.credential(email, password);
    // Reauthenticate
    await reauthenticateWithCredential(user, credential);

    // Get all user's workouts
    const workoutsRef = collection(db, "users", user.uid, "workouts");
    const workoutsQuery = query(workoutsRef, where("uid", "==", user.uid));
    const workoutsSnapshot = await getDocs(workoutsQuery);

    // Get user's username
    const usernameRef = collection(db, "usernames");
    const usernameQuery = query(usernameRef, where("uid", "==", user.uid));
    const usernameSnapshot = await getDocs(usernameQuery);

    // Create a new batch object
    const batch = writeBatch(db);

    // Add workout deletions to batch
    workoutsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Add username deletion to batch
    usernameSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user document
    const userRef = doc(db, "users", user.uid);
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

    // 2. Delete the Auth account
    await deleteUser(user);

    // 3. Clear local storage
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);

    if (error.code === "auth/wrong-password") {
      return {
        success: false,
        error: "Incorrect password. Please try again.",
      };
    }

    if (error.code === "auth/missing-password") {
      return {
        success: false,
        error: "Password is required to delete your account.",
      };
    }

    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        error:
          "For security reasons, please re-enter your password to delete your account.",
        requiresReauthentication: true,
      };
    }

    if (error.code === "auth/too-many-requests") {
      return {
        success: false,
        error: "Too many requests. Please try again in 5-15 minutes.",
        requiresReauthentication: true,
      };
    }
    if (error.code === "auth/invalid-credential") {
      return {
        success: false,
        error: "Invalid Credential",
        requiresReauthentication: true,
      };
    }
    return { success: false, error: error.message };
  }
};

export default DeleteUserAccount;
