import Loader from "../../components/Loader";
import ClassListings from "../../components/ClassListings";

function InstructorViewWorkoutList({
  isLoading,
  error,
  workouts,
  isOwner,
  isAdminPage,
  usernameParam,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader show={isLoading} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (workouts?.length > 0) {
    return (
      <>
        <h1 className="text-3xl font-bold text-navy mb-6 text-center">
          {isOwner || isAdminPage
            ? "Manage Your Workouts"
            : `@${usernameParam}'s Workouts`}
        </h1>
        <ClassListings workouts={workouts} admin={isOwner} />
      </>
    );
  }

  return (
    <p className="text-center text-gray-500">There are no workouts yet.</p>
  );
}

export default InstructorViewWorkoutList;
