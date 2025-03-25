import AuthCheck from "../components/AuthCheck";
import WorkoutList from "../components/WorkoutList";
import CreateNewWorkout from "../components/CreateNewWorkout";

async function AdminPage({ params }) {
  const usernameParam = await params?.username; // Get `usernameParam` from the URL

  return (
    <main>
      <AuthCheck>
        <CreateNewWorkout />
        <WorkoutList usernameParam={usernameParam} />
      </AuthCheck>
    </main>
  );
}

export default AdminPage;
