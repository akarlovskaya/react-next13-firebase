
import { getFirestore, collectionGroup, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore, postToJSON, getIt } from './lib/firebase';
import Metatags from './components/Metatags';
import ClassListings from "./components/ClassListings";
import LoadMoreWorkouts from "./components/LoadMoreWorkouts";

// Max post to query per page
const LIMIT = 6;

// Fetch posts data (server-side)
async function fetchInitialWorkouts() {
  const ref = collectionGroup(getFirestore(), 'workouts');
  const workoutsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  );
  const workouts = (await getDocs(workoutsQuery)).docs.map(postToJSON);
 
  return {
    props: { workouts }, // will be passed to the page component as props
  };
}

export default async function Home() {
  const initialWorkouts = await fetchInitialWorkouts();

  return (
    <main>
      <Metatags title="Workouts" description="Discover the latest workouts" />

      <div className="card card-info">
        <h2>🔥 Workouts</h2>
        <p>Check out the latest workouts on our platform. Get inspired and stay fit!</p>
      </div>

      <ClassListings workouts={initialWorkouts.props.workouts} />

      {/* Load more functionality in Client Component */}
      <LoadMoreWorkouts initialWorkouts={initialWorkouts.props.workouts} />
    </main>
  );
}