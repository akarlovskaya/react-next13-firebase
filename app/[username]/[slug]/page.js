import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
  getFirestore,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkoutPageContent from "../../components/WorkoutPageContent";
// import AuthCheck from '@components/AuthCheck';

// Metatags
export async function generateMetadata({ params }) {
  const { username, slug } = await params;

  if (!slug) {
    return {
      title: "Workout Not Found",
      description: "This workout could not be found.",
    };
  }

  return {
    title: slug,
    description: `Join ${username} in ${slug} class!`,
  };
}

// Export revalidation period (ISR). Pages are revalidated every 100 seconds
// export const revalidate = 100;

// Fetch workout data during build or ISR
// export async function generateStaticParams() {
//   const q = query(collectionGroup(getFirestore(), "workouts"), limit(20));
//   const snapshot = await getDocs(q);

//   const paths = snapshot.docs.map((doc) => {
//     const { slug, username } = doc.data();
//     return { username, slug };
//   });

//   return paths;
// }

// Data fetching
async function getWorkoutData(username, slug) {
  try {
    // Fetch workout data from firebase
    const userDoc = await getUserWithUsername(username);
    // getUserWithUsername returns a plain object (no ref there), we need to recreate the path
    const userPath = `users/${userDoc.uid}`;

    if (!userDoc) {
      return null;
    }

    const postRef = doc(getFirestore(), userPath, "workouts", slug);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return null;
    }

    // Verify fetched data
    // console.log('Verify fetched Workout data:', postToJSON(postSnapshot));
    return postToJSON(postSnapshot);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return null;
  }
}

// Dynamic page component
export default async function WorkoutPage({ params }) {
  const { username, slug } = await params;
  const workout = await getWorkoutData(username, slug);

  if (!workout) {
    notFound();
  }

  // Generate metadata for this page
  generateMetadata({ params, workout });

  return (
    <main>
      <WorkoutPageContent workout={workout} />
    </main>
  );
}
