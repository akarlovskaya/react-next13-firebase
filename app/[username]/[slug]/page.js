import {
  firestore,
  getUserWithUsername,
  postToJSON,
  participantToJSON,
} from "../../lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkoutPageContent from "../../components/WorkoutPageContent";

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
  const db = getFirestore();

  // Fetch workout data from firebase
  const userDoc = await getUserWithUsername(username);
  if (!userDoc) {
    return { workout: null, participants: [] };
  }
  // getUserWithUsername returns a plain object (no ref there), we need to recreate the path
  const userPath = `users/${userDoc.uid}`;

  // Get workout
  const workoutRef = doc(db, userPath, "workouts", slug);
  const workoutSnap = await getDoc(workoutRef);

  if (!workoutSnap.exists()) {
    return null;
  }

  // Get participants (empty array if subcollection doesn't exist)
  let participants = [];

  try {
    const participantsSnap = await getDocs(
      collection(db, userPath, "workouts", slug, "participants")
    );
    // participants = participantsSnap.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    participants = participantsSnap.docs.map(participantToJSON); // use custom participantToJSON to convert to plain objects
  } catch (e) {
    console.log("No participants yet", e);
  }

  return {
    workout: postToJSON(workoutSnap),
    participants,
  };
}

// Dynamic page component
export default async function WorkoutPage({ params }) {
  const { username, slug } = await params;
  const { workout, participants = [] } = await getWorkoutData(username, slug);

  if (!workout) {
    notFound();
  }

  // Generate metadata for this page
  generateMetadata({ params, workout });

  return (
    <main>
      <WorkoutPageContent workout={workout} participants={participants} />
    </main>
  );
}
