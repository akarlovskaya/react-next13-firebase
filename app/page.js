
import { getFirestore, collectionGroup, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore, postToJSON, getIt } from './lib/firebase';
import ClassListings from "./components/ClassListings";
import LoadMoreWorkouts from "./components/LoadMoreWorkouts";
import HeroBanner from './components/HeroBanner';
import HomePageCardsWrapper from './components/HomePageCardsWrapper';

// Max post to query per page
const LIMIT = 6;

// Fetch posts data (server-side)
async function fetchInitialWorkouts() {
  const ref = collectionGroup(getFirestore(), 'workouts');
  const workoutsQuery = query(
    ref,
    // where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  );
  const workouts = (await getDocs(workoutsQuery)).docs.map(postToJSON);
  console.log('workouts', workouts);
 
  return {
    props: { workouts }, // will be passed to the page component as props
  };
}

export default async function Home() {
  const initialWorkouts = await fetchInitialWorkouts();
  // console.log('initialWorkouts ', initialWorkouts);

  return (
    <main>
      <HeroBanner/>
      {/* <HomePageCardsWrapper /> */}
      
      <ClassListings 
        workouts={initialWorkouts.props.workouts} 
        isHomepage={true}
        admin={false}
      />

      {/* Load more functionality in Client Component */}
      <section className="m-auto max-w-lg my-10 px-6">
      <LoadMoreWorkouts initialWorkouts={initialWorkouts.props.workouts} />
      </section>
      
    </main>
  );
}