import AuthCheck from "../components/AuthCheck";
import WorkoutList from "../components/WorkoutList";
import CreateNewWorkout from "../components/CreateNewWorkout";

const AdminPage = () => {
  return (
    <main>
      AdminPage
      <AuthCheck>
        <WorkoutList />
        <CreateNewWorkout />
      </AuthCheck>
    </main>
  )
}

export default AdminPage;