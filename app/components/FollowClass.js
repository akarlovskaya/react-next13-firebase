"use client";
import { useState } from "react";
import {
  getFirestore,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import Spinner from "../components/Loader.js";

const db = getFirestore();

export default function FollowClass({
  workout,
  currentUser,
  isFollowing,
  setIsFollowing,
}) {
  const [isLoading, setIsLoading] = useState(false);
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

  async function unFollowClass() {
    setIsLoading(true);

    try {
      const batch = writeBatch(db);

      // Delete the participant document
      const participantRef = doc(
        db,
        "users",
        workout.uid,
        "workouts",
        slug,
        "participants",
        currentUser.uid
      );
      batch.delete(participantRef);

      // Update participant count
      const workoutRef = doc(db, `users/${workout.uid}/workouts/${slug}`);
      batch.update(workoutRef, {
        participantCount: increment(-1),
      });

      // Execute the batch
      await batch.commit();

      toast.success(`You've successfully unfollowed the ${title} class.`);
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing class:", error);
      toast.error("Failed to unfollow class. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner show={isLoading} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 text-center mt-6">
      {isFollowing ? (
        <>
          <div className="inline-flex items-center px-3 py-2 bg-beige text-blue-600 font-medium rounded-md text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            You are Following the Class Changes
          </div>
          <br></br>
          <button
            onClick={unFollowClass}
            className="text-blue-600 text-sm font-medium hover:underline mt-4"
          >
            Unfollow Class
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">Get Notified About Class Changes</p>
          <button
            onClick={requestToJoinClass}
            className="flex justify-center w-40 justify-self-center bg-orange-dark text-white px-7 py-3 mt-5 text-sm font-medium rounded shadow-md hover:bg-orange-light"
          >
            Follow Class
          </button>
        </>
      )}
    </div>
  );
}

// //Security Rules Needed
// // match /users/{userId}/workouts/{workoutId}/participants/{participantId} {
// //   allow create: if request.auth != null && request.auth.uid == userId;
// // }

// //If needed to track all workouts a user joined, add a reverse mapping (e.g., users/{userId}/joinedWorkouts).
