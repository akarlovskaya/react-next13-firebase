import ClassListing from "./ClassListing";

// aka post feed
function ClassListings({ workouts, admin }) {
  return (
    <>
      {workouts.length > 0 ? (
        <section className="bg-blue-50 px-4 py-10">
          <div className="md:container lg:container m-auto">
            <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
      ) : null}
    </>
  );
}

export default ClassListings;
