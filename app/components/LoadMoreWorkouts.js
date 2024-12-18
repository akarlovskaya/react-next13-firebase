'use client';
import { useState } from 'react';
import { firestore, postToJSON, getIt } from '../lib/firebase';
import { getFirestore, collectionGroup, query, where, orderBy, startAfter, limit, getDocs, Timestamp } from 'firebase/firestore';
import Loader from "./Loader";
import ClassListings from "../components/ClassListings";

const LIMIT = 10;

export default function LoadMoreWorkouts({ initialWorkouts }) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [loading, setLoading] = useState(false);
  const [workoutsEnd, setWorkoutsEnd] = useState(false);

  const getMoreWorkouts = async () => {
    if (workoutsEnd || loading) return;

    setLoading(true);

    // const firestore = getFirestore();
    const lastWorkout = workouts[workouts.length - 1];

    const cursor =
      typeof lastWorkout.createdAt === 'number'
        ? Timestamp.fromMillis(lastWorkout.createdAt)
        : lastWorkout.createdAt;

    const workoutsQuery = query(
      collectionGroup(firestore, 'workouts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newWorkouts = (await getDocs(workoutsQuery)).docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toMillis?.() || 0,
      };
    });

    setWorkouts(prev => [...prev, ...newWorkouts]);
    setLoading(false);

    if (newWorkouts.length < LIMIT) {
        setWorkoutsEnd(true);
    }
  };

  return (
    <div>
      {/* <ClassListings workouts={workouts} /> */}
      {!loading && !workoutsEnd && (
        <button onClick={getMoreWorkouts}>
          Load more
        </button>
      )}
      <Loader show={loading} />
      {workoutsEnd && <p>You've reached the end!</p>}
    </div>
  );
}


