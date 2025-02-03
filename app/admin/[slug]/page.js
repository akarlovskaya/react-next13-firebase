import styles from "../../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import WorkoutPostManager from "../../components/WorkoutPostManager";

const AdminWorkoutEditPage = async ({ params }) => {
  const { slug } = await params; // Accessing slug directly

  return (
    <div className={styles.container}>
      AdminWorkoutEditPage
      <AuthCheck>
        <WorkoutPostManager slug={slug} />
      </AuthCheck>
    </div>
  );
};

export default AdminWorkoutEditPage;
