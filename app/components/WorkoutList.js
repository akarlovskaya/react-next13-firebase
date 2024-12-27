'use client';
import { auth } from '../lib/firebase';
import { query, collection, orderBy, getFirestore } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import ClassListings from "../components/ClassListings";
import Loader from "../components/Loader";


function WorkoutList() {
    if (!auth.currentUser) {
        return <Loader />
      }
    
      const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'workouts')
      const postQuery = query(ref, orderBy('createdAt'))
    
      const [querySnapshot] = useCollection(postQuery);
    
      const workouts = querySnapshot?.docs.map((doc) => doc.data());
    
      return (
        <>
          <h1>Manage your Workouts</h1>
          <ClassListings workouts={workouts} admin />
        </>
      )
}

export default WorkoutList