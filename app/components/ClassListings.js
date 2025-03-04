import ClassListing from "./ClassListing";

// aka post feed
function ClassListings({ workouts, admin }) {
  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workouts
            ? workouts.map((workout) => (
                <ClassListing
                  workout={workout}
                  key={workout.slug}
                  admin={admin}
                />
              ))
            : null}
        </ul>
      </div>
    </section>
  );
}

export default ClassListings;
