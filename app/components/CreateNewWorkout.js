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
            published: false,
            // content: content || '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(ref, data);

          toast.success('Post created!');
      
          // Imperative navigation after doc is set
          router.push(`/admin/${slug}`);
    }

  return (
    <form onSubmit={createWorkout}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={''}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} >
        Create New Post
      </button>
    </form>
  )
}

export default CreateNewWorkout;