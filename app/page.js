
import { getFirestore, collectionGroup, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { postToJSON } from './lib/firebase';
import HeroBanner from './components/HeroBanner';
import HomePageCardsWrapper from './components/HomePageCardsWrapper';
import HomePageClassListings from './components/HomePageClassListings';

// Max workout posts to query per page
const LIMIT = 6;

// Server-side data fetching
async function fetchInitialWorkouts() {
  const ref = collectionGroup(getFirestore(), 'workouts');
  const workoutsQuery = query(
      ref,
      orderBy('createdAt', 'desc'),
      limit(LIMIT),
  );
  const workouts = (await getDocs(workoutsQuery)).docs.map(postToJSON);

  return {
    props: { workouts }, // Pass initial data to the component
    revalidate: 60, // Regenerate the page every 60 seconds (ISR)
  };
}

export default async function Home() {
  const initialWorkouts = await fetchInitialWorkouts();


  return (
    <main>
      <HeroBanner/>
      {/* <HomePageCardsWrapper /> */}
      <HomePageClassListings workouts={ initialWorkouts.props.workouts } limit={LIMIT}/>
    </main>
  );
}