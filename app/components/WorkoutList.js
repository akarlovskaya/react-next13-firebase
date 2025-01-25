"use client";
import { auth, postToJSON } from "../lib/firebase";
import { query, collection, orderBy, getFirestore } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ClassListings from "../components/ClassListings";
import Loader from "../components/Loader";

function WorkoutList() {
  if (!auth.currentUser) {
    return <Loader />;
  }

  const ref = collection(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "workouts"
  );
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);

  const workouts = querySnapshot?.docs.map(postToJSON);

  return (
    <>
      {workouts?.length > 0 && (
        <section className="bg-indigo-50 px-4 py-10">
          <div className="container-xl lg:container m-auto">
            <h1 className="text-3xl font-bold text-navy mb-6 text-center">
              Manage Your Workouts
            </h1>
            <ClassListings workouts={workouts} admin />
          </div>
        </section>
      )}
    </>
  );
}

export default WorkoutList;
