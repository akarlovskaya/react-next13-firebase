import { getUserWithUsername, postToJSON } from '../lib/firebase';
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import UserProfile from "../components/UserProfile";
import ClassListings from "../components/ClassListings";

// Metatags
export async function generateMetadata({ params }) {
  const { username } = params;

  return {
    title: username,
    description: `${username}'s classes, about and contacts`,
  }
}

// Add export const dynamic = 'force-dynamic' to ensure server-side rendering
export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  const userDoc = await getUserWithUsername(username);

  // If no user, render not-found.js
  if (!userDoc) {
    notFound();
  }

  // JSON serializable data
  const user = userDoc.data();
  console.log('user from profile ', user.username);

  const postsQuery = query(
    collection(getFirestore(), userDoc.ref.path, 'workouts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  const postsSnapshot = await getDocs(postsQuery);
  const workouts = postsSnapshot.docs.map(postToJSON);

  return (
    <main>
      <UserProfile user={user}/>
      <ClassListings workouts={workouts}/>
    </main>
  );
}