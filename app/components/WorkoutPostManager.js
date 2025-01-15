'use client';
import { useState } from 'react';
import { firestore, auth } from '../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import WorkoutAddForm from './WorkoutAddForm';
import DeleteWorkoutButton from './DeleteWorkoutButton';
import Link from 'next/link';
// import { useForm } from 'react-hook-form';


function WorkoutPostManager({ slug }) {
  const [preview, setPreview] = useState(false);

  const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'workouts', slug)
  const [post] = useDocumentDataOnce(postRef);
  console.log('post from WorkoutPostManager to WorkoutAddForm', post)

  return (

    <section className="bg-indigo-50">
    <div className="container m-auto max-w-2xl py-24">
    <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
    <h1 className="text-3xl text-center font-semibold mb-6">Add Class Details</h1>
      {post && (
        <>
          <section>
            <WorkoutAddForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          {/* <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit">Live View</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside> */}
        </>
      )}
      </div>
      </div>
      </section>
  )
}

export default WorkoutPostManager;