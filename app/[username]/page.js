import { getUserWithUsername, postToJSON } from '../lib/firebase';
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Metatags from '../components/Metatags';
import UserProfile from "../components/UserProfile";
import ClassListings from "../components/ClassListings";

// Add export const dynamic = 'force-dynamic' to ensure server-side rendering
export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }) {
  const { username } = await params;
  console.log('username from profile ', username);

  const userDoc = await getUserWithUsername(username);

  // If no user, render not-found.js
  if (!userDoc) {
    notFound();
  }

  // JSON serializable data
  const user = userDoc.data();
  console.log('user from profile ', user.username);

  const postsQuery = query(
    collection(getFirestore(), userDoc.ref.path, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map(postToJSON);

  return (
    <main>
      <Metatags title={user.username} description={`${user.username}'s public profile`} />
      <UserProfile user={user}/>
      <ClassListings workouts={posts}/>
    </main>
  );
}