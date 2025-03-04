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
import ClassListings from "../components/ClassListings";
import Loader from "../components/Loader";
import { usePathname } from "next/navigation";

function WorkoutList({ usernameParam }) {
  const { username } = useContext(UserContext);
  const isOwner = username === usernameParam;
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const db = getFirestore();
      let workoutsQuery, userDoc;

      //Fetch workouts for Guest (signed-in user) and Not signed-in user views someone else's profile (the user specified in `usernameParam`)
      if (usernameParam) {
        userDoc = await getUserWithUsername(usernameParam);
        if (!userDoc) {
          setError("User not found");
          console.error("User not found");
          setWorkouts([]); // Clear workouts
          setIsLoading(false); // Stop loading
          return;
        }

        workoutsQuery = query(
          collection(db, userDoc.ref.path, "workouts"),
          where("published", "==", true),
          orderBy("createdAt", "desc")
        );
      } else if (username) {
        //Fetch workouts for the authenticated (owner) user
        userDoc = await getUserWithUsername(username);
        if (!userDoc) {
          console.error("User not found");
          return;
        }

        workoutsQuery = query(
          collection(db, userDoc.ref.path, "workouts"),
          // where("published", "==", true), - show all workouts in admin
          orderBy("createdAt", "desc")
        );
      } else {
        // No user is signed in, and no `usernameParam` is provided
        setWorkouts([]);
        return;
      }

      const workoutsSnapshot = await getDocs(workoutsQuery);
      const workoutsTrial = workoutsSnapshot.docs.map(postToJSON);
      setWorkouts(workoutsTrial);
      setIsLoading(false);
    };

    fetchWorkouts();
  }, [username, usernameParam]);

  return (
    <>
      <section className="bg-indigo-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loader show={isLoading} />
            </div>
          ) : workouts?.length > 0 ? (
            <>
              <h1 className="text-3xl font-bold text-navy mb-6 text-center">
                {isOwner || isAdminPage
                  ? "Manage Your Workouts"
                  : `@${usernameParam}'s Workouts`}
              </h1>
              <ClassListings workouts={workouts} admin={isOwner} />
            </>
          ) : (
            <p className="text-center text-gray-500">
              There are no workouts yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
export default WorkoutList;
