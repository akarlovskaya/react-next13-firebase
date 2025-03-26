"use client";
import { postToJSON, getUserWithUsername } from "../lib/firebase";
import {
  query,
  collection,
  orderBy,
  getFirestore,
  where,
  getDocs,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Provider";
import { usePathname } from "next/navigation";
import InstructorViewWorkoutList from "../components/UserProfileForm/InstructorViewWorkoutList";

function WorkoutList({ usernameParam }) {
  const { username, role } = useContext(UserContext);
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const isOwner = username === usernameParam || isAdminPage;
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserWorkouts = async (username) => {
    const db = getFirestore();
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
      setError("User not found");
      console.error("User not found");
      setWorkouts([]); // Clear workouts
      setIsLoading(false); // Stop loading
      return;
    }

    // getUserWithUsername returns a plain object (no ref there), we need to recreate the path
    const userPath = `users/${userDoc.uid}`;

    return query(
      collection(db, userPath, "workouts"),
      isAdminPage ? null : where("published", "==", true), // show all workouts including drafts on admin page or only published
      orderBy("createdAt", "desc")
    );
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      let workoutsQuery;

      //Fetch workouts for Guest (signed-in user) and Not signed-in user views someone else's profile (the user specified in `usernameParam`)
      if (usernameParam) {
        workoutsQuery = await fetchUserWorkouts(usernameParam);
      } else if (username) {
        //Fetch workouts for the authenticated (owner) user
        workoutsQuery = await fetchUserWorkouts(username);
      } else {
        // No user is signed in, and no `usernameParam` is provided
        setIsLoading(false);
        return;
      }

      if (workoutsQuery) {
        const workoutsSnapshot = await getDocs(workoutsQuery);
        const workouts = workoutsSnapshot.docs.map(postToJSON);
        setWorkouts(workouts);
      }
      setIsLoading(false);
    };

    fetchWorkouts();
  }, [username, usernameParam, isAdminPage]);

  if (role === "participant") {
    return;
  }

  return (
    <>
      <section className="bg-indigo-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          {role === "participant" ? null : (
            <InstructorViewWorkoutList
              isLoading={isLoading}
              error={error}
              workouts={workouts}
              isOwner={isOwner}
              isAdminPage={isAdminPage}
              usernameParam={usernameParam}
            />
          )}
        </div>
      </section>
    </>
  );
}
export default WorkoutList;
