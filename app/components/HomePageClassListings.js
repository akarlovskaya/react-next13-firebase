'use client';
import { useState } from 'react';
import { firestore, postToJSON, getIt } from '../lib/firebase';
import { collectionGroup, query, where, orderBy, startAfter, limit as firestoreLimit, getDocs, Timestamp } from 'firebase/firestore';
import Loader from "./Loader";
import ClassListings from "./ClassListings";

function HomePageClassListings({ workouts, limit }) {
    const [ currentWorkouts, setCurrentWorkouts ] = useState(workouts);
    const [ loading, setLoading ] = useState(false);
    const [ workoutsEnd, setWorkoutsEnd ] = useState(false);

    const getMoreWorkouts = async () => {
        if (workoutsEnd || loading) return;    
        setLoading(true);
    
        const lastWorkout = currentWorkouts[currentWorkouts.length - 1];
    
        const cursor =
          typeof lastWorkout?.createdAt === 'number'
            ? Timestamp.fromMillis(lastWorkout.createdAt)
            : lastWorkout.createdAt;
    
        const workoutsQuery = query(
          collectionGroup(firestore, 'workouts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          startAfter(cursor),
          firestoreLimit(limit)
        );
    
        const newWorkouts = (await getDocs(workoutsQuery)).docs.map(postToJSON);
    
        setCurrentWorkouts(prev => [...prev, ...newWorkouts]);
        setLoading(false);
    
        if (newWorkouts.length < limit) {
            setWorkoutsEnd(true);
        }
      };

  return (
    <>
        <ClassListings 
        workouts={currentWorkouts} 
        isHomepage={true}
        admin={false}
        />
        <section className="m-auto max-w-lg my-10 px-6">
            <div className='flex justify-center'>

            {!loading && !workoutsEnd && (
                <button 
                onClick={getMoreWorkouts}
                className="bg-navy hover:bg-gray-900 text-white py-2 px-4 rounded-full w-52 mt-8 focus:outline-none focus:shadow-outline"
                >
                Load more
                </button>
            )}
            <Loader show={loading} />
            {workoutsEnd && <p className='font-bold mt-8'>You&#39;ve reached the end!</p>}
            </div>
        </section>
    </>
  )
}

export default HomePageClassListings;