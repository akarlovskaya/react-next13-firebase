"use client";
import { useState } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
// import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const db = getFirestore();

export default function FollowClass({
  workout,
  currentUser,
  isFollowing,
  setIsFollowing,
}) {
  // const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  // const [isFollowing, setIsFollowing] = useState(false);

  const { title, slug } = workout;

  async function requestToJoinClass() {
    if (!currentUser) {
      toast.error("Please sign in to join the class");
      return;
    }

    setIsLoading(true);

    try {
      // Use batch to ensure atomicity
      const batch = writeBatch(db);

      // Add participant with 'pending' status
      const participantRef = doc(
        db,
        "users",
        workout.uid,
        "workouts",
        slug,
        "participants",
        currentUser.uid
      );

      batch.set(participantRef, {
        joinedAt: serverTimestamp(),
        userName: currentUser.displayName,
        email: currentUser.email,
        status: "pending", // This triggers cloud function
      });

      // Update participant count
      const workoutRef = doc(db, `users/${workout.uid}/workouts/${slug}`);
      batch.update(workoutRef, {
        participantCount: increment(1),
      });

      // Execute the batch
      await batch.commit();

      toast.success(
        `Request submitted! We're sending you a confirmation email.`,
        { duration: 5000 }
      );

      setIsFollowing(true);
    } catch (error) {
      console.error("Error joining class:", error);

      // More specific error messages
      if (error.code === "permission-denied") {
        toast.error("You don't have permission to join this class.");
      } else if (error.code === "already-exists") {
        toast.error("You're already registered for this class.");
      } else {
        toast.error("Failed to join class. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <button
        onClick={requestToJoinClass}
        disabled={isLoading || isFollowing}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          isFollowing
            ? "bg-green-100 text-green-800 cursor-not-allowed"
            : isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            Joining...
          </>
        ) : isFollowing ? (
          "Registration Submitted"
        ) : (
          "Join Class"
        )}
      </button>

      {isFollowing && (
        <p className="text-sm text-gray-600 mt-2">
          📧 Check your email for confirmation. If you don't receive it, your
          registration will be cancelled automatically.
        </p>
      )}
    </div>
  );
}

// //Security Rules Needed
// // match /users/{userId}/workouts/{workoutId}/participants/{participantId} {
// //   allow create: if request.auth != null && request.auth.uid == userId;
// // }

// //If needed to track all workouts a user joined, add a reverse mapping (e.g., users/{userId}/joinedWorkouts).
