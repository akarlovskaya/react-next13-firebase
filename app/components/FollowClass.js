import React from "react";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import toast from "react-hot-toast";

function FollowClass({ workout, currentUser, isFollowing }) {
  const db = getFirestore();
  const functions = getFunctions();
  const { title, slug, address, time } = workout;

  async function requestToJoinClass() {
    alert("in requestToJoinClass");

    try {
      console.log(
        `Writing to: users/${workout.uid}/workouts/${slug}/participants/${currentUser.uid}`
      );

      await setDoc(
        // Path: users/{userId}/workouts/{workoutId}/participants/{userId}
        doc(
          db,
          "users",
          workout.uid,
          "workouts",
          slug,
          "participants",
          currentUser.uid
        ),
        {
          email: currentUser.email,
          registeredAt: new Date().toISOString(),
          status: "confirmed",
        }
      );

      // TO DO?: Update user's following classes

      // Call cloud function to send confirmation email
      // const sendConfirmationEmail = httpsCallable(
      //   functions,
      //   "sendConfirmationEmail"
      // );
      // await sendConfirmationEmail({
      //   email: currentUser.email,
      //   workout,
      // });

      toast.success(
        `Success! You're now following ${title} class! Check your email for confirmation.`
      );

      // alert(
      //   `Request to join ${title} at ${time}, ${address.place} sent successfully!`
      // );
    } catch (error) {
      console.error("Error joining class:", error);
      alert("Failed to follow class. Please try again." + error.message);
      toast.error("Failed to follow class. Please try again.");
    }
  }

  function unFollowClass() {
    alert("in unFollowClass");
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

export default FollowClass;

//Security Rules Needed
// match /users/{userId}/workouts/{workoutId}/participants/{participantId} {
//   allow create: if request.auth != null && request.auth.uid == userId;
// }

//If you need to track all workouts a user joined, consider adding a reverse mapping (e.g., users/{userId}/joinedWorkouts).
