import ClassListing from "./ClassListing";

// aka post feed
function ClassListings({workouts, admin}) {
  // console.log('workoutsfrom Classlistings ', workouts);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
      { workouts ? 
          workouts.map((workout) => <ClassListing workout={workout} key={workout.slug} admin={admin} />) : null
      }
    </ul>
  )
}

export default ClassListings;