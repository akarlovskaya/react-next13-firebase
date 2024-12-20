import ClassListing from "./ClassListing";

// aka post feed
function ClassListings({workouts, admin}) {
  // console.log('workoutsfrom Classlistings ', workouts);

  return (
    <>
      ClassListings Component
      { workouts ? 
          workouts.map((workout) => <ClassListing workout={workout} key={workout.slug} admin={admin} />) : null
      }
    </>
  )
}

export default ClassListings;