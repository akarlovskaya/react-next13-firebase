// import AuthCheck from '@components/AuthCheck';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WorkoutPageContent from '../../components/WorkoutPageContent';
import Metatags from '../../components/Metatags';
import toast from 'react-hot-toast';


// Export revalidation period (ISR). Pages are revalidated every 100 seconds
export const revalidate = 100;

// Fetch workout data during build or ISR
export async function generateStaticParams() {
  // Fetch posts for pre-rendering (limited to 20 for now)
  const q = query(collectionGroup(getFirestore(), 'workouts'), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return { username, slug };
  });

  return paths;
}

// Dynamic page component
export default async function WorkoutPage({ params }) {
  // Await params before using it to destructure
  const { username, slug } = await params;

  try {
    // Fetch workout data
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        notFound();
    }

    const postRef = doc(getFirestore(), userDoc.ref.path, 'workouts', slug);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      notFound();
    }

    const workout = postToJSON(postSnapshot);
    console.log('Workout data:', workout);  // Verify fetched data

    return (
      <main>
        <Metatags title={`This is ${workout.title} class page.`} description={`Join ${username} in ${workout.title} class!`} />
        <WorkoutPageContent workout={workout} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching workout:', error);
    notFound();
  }
}