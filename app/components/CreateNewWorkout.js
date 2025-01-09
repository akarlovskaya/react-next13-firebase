'use client';
import { useContext, useState } from 'react';
import { UserContext } from "../Provider";
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { serverTimestamp, getFirestore, setDoc, doc } from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';


function CreateNewWorkout() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));
    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createWorkout = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), 'users', uid, 'workouts', slug);

        const data = {
            title: title || 'Untitled',
            slug: slug || 'default-slug',
            uid: uid || 'default-uid',
            username: username || 'default-username',
            description: '',
            time: '', // To-do validate!
            daysOfTheWeek: [],
            fee: '',
            address: {
              locationName: '',
              streetAddress: '',
              city: '',
              province: '',
              zip: ''
            },
            paymentOptions: [],
            published: false,
            createdAt: serverTimestamp()
          };

          await setDoc(ref, data);

          // toast.success('Post created!');
      
          // Imperative navigation after doc is set
          router.push(`/admin/${slug}`);
    }

  return (
  
        <section className="bg-indigo-50">
          <code>AdminPage</code>
          <div className="container m-auto max-w-2xl py-24">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl text-center font-semibold mb-6">Add Class</h1>
          <h2 className="text-2xl text-center font-semibold mb-6">Enter Workout Name</h2>

          <form onSubmit={createWorkout}>
            <label htmlFor='workoutName' className="sr-only">
              Workout Name
            </label>
            <input
              id='workoutName'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Workout!"
              className="border rounded w-full py-2 px-3 mb-10"
            />
            {/* <p>
              <strong>Slug:</strong> {slug}
            </p> */}

            <button 
              className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit" 
              disabled={!isValid} >
              Create
            </button>
          </form>

          </div>
          </div>
        </section>
  )
}

export default CreateNewWorkout;